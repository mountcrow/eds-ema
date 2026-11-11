/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://www.terna.it/en (.area--area-1 .cmp--terna-sliderfullheight)
 * Structure (from library-description.txt): 2 columns.
 *   Row 1: block name "Carousel"
 *   Each subsequent row = [image] | [title + text + CTA link]
 * Source markup: .swiper-slide contains .item-title, .item-text,
 *   a.terna-link (inside .item-link) / a.overlay-link, and img.swiper-slide-image.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Slides: use the primary (non-duplicate) swiper-slides.
  const slides = Array.from(element.querySelectorAll('.swiper-slide'));

  slides.forEach((slide) => {
    // Background image (mandatory for a slide row).
    // NOTE: images are lazy-loaded (lozad); off-screen slides may keep the real
    // URL in data-src/data-original with a placeholder src. Never fall back to a
    // bare `img` selector — that would pick up the CTA arrow icon.
    const imgEl = slide.querySelector('img.swiper-slide-image, img[class*="slide-image"]');
    let image = null;
    if (imgEl) {
      const realSrc = imgEl.getAttribute('src')
        || imgEl.getAttribute('data-src')
        || imgEl.getAttribute('data-original')
        || imgEl.getAttribute('data-lazy');
      if (realSrc && !realSrc.startsWith('data:')) {
        image = document.createElement('img');
        image.setAttribute('src', realSrc);
        if (imgEl.getAttribute('alt')) image.setAttribute('alt', imgEl.getAttribute('alt'));
      } else if (realSrc) {
        // Only a placeholder available; still reference the original element so
        // its resolved src is captured when present.
        image = imgEl;
      }
    }

    // Text content cell.
    const contentCell = [];

    const titleEl = slide.querySelector('.item-title');
    if (titleEl) {
      const titleText = titleEl.textContent.trim();
      if (titleText) {
        const h = document.createElement('h2');
        h.textContent = titleText;
        contentCell.push(h);
      }
    }

    const textEl = slide.querySelector('.item-text');
    if (textEl) {
      const p = document.createElement('p');
      p.textContent = textEl.textContent.trim();
      if (p.textContent) contentCell.push(p);
    }

    // CTA: prefer the visible .item-link anchor, fall back to the overlay link,
    // then to a video "play" button (video slides carry a YouTube link instead
    // of a text CTA). All are mutually exclusive within a slide in practice.
    const ctaSource = slide.querySelector('.item-link a[href]')
      || slide.querySelector('a.overlay-link[href]')
      || slide.querySelector('a.play-btn[href]');
    if (ctaSource && ctaSource.getAttribute('href')) {
      const link = document.createElement('a');
      link.setAttribute('href', ctaSource.getAttribute('href'));
      const label = ctaSource.getAttribute('title')
        || ctaSource.textContent.trim()
        || 'Find out more';
      link.textContent = label;
      const p = document.createElement('p');
      p.append(link);
      contentCell.push(p);
    }

    // Only add a slide row if we have at least an image or content.
    if (image || contentCell.length) {
      cells.push([image || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
