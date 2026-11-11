/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-media. Base: cards (with images).
 * Sources (https://www.terna.it/en):
 *   .area--area-5 .cmp--terna-slidecontent   (blog cards)
 *   .area--area-32 .cmp--terna-slidecontent  (promo cards)
 * Structure (from library-description.txt): 2 columns, multiple rows.
 *   Row 1: block name "Cards"
 *   Each subsequent row = [image] | [eyebrow + title + CTA link]
 * Source markup: .swiper-slide with a direct child <img> (card image) and
 *   .swiper-slide-content holding:
 *     .terna-slidecontent-item-section a.item-title  -> eyebrow (logo link)
 *     .terna-slidecontent-item-title                 -> title
 *     .terna-slidecontent-item-text                  -> description (often empty)
 *     .terna-slidecontent-item-link a.terna-link     -> CTA
 * NOTE: a.item-title here is the eyebrow logo link, NOT the title — the title
 *   lives in .terna-slidecontent-item-title. Selectors are chosen to avoid that
 *   collision.
 */
export default function parse(element, { document }) {
  const cells = [];
  const seen = new Set();

  const slides = Array.from(element.querySelectorAll('.swiper-slide'));

  slides.forEach((slide) => {
    // Card image: the direct <img> child of the slide (not images inside content).
    let image = Array.from(slide.children).find((c) => c.tagName === 'IMG')
      || slide.querySelector(':scope > img');

    const content = slide.querySelector('.swiper-slide-content') || slide;

    // Title.
    const titleEl = content.querySelector('.terna-slidecontent-item-title, [class*="item-title"]:not(a)');
    const titleText = titleEl ? titleEl.textContent.trim() : '';

    // De-duplicate swiper clones by title + image src.
    const imgSrc = image ? (image.getAttribute('src') || image.getAttribute('data-src') || '') : '';
    const key = titleText + '|' + imgSrc;
    if (titleText && seen.has(key)) return;
    if (titleText) seen.add(key);

    const contentCell = [];

    // Eyebrow: the logo/category link (a.item-title) — use its title/alt as text.
    const eyebrowLink = content.querySelector('.terna-slidecontent-item-section a, a.item-title');
    if (eyebrowLink) {
      const eyebrowText = eyebrowLink.getAttribute('title')
        || (eyebrowLink.querySelector('img') ? eyebrowLink.querySelector('img').getAttribute('alt') : '')
        || eyebrowLink.textContent.trim();
      if (eyebrowText) {
        const eyebrow = document.createElement('p');
        const em = document.createElement('em');
        em.textContent = eyebrowText;
        eyebrow.append(em);
        contentCell.push(eyebrow);
      }
    }

    // Title as heading.
    if (titleText) {
      const h = document.createElement('h3');
      h.textContent = titleText;
      contentCell.push(h);
    }

    // Description (skip if empty / just a non-breaking space).
    const textEl = content.querySelector('.terna-slidecontent-item-text, [class*="item-text"]');
    if (textEl) {
      const desc = textEl.textContent.replace(/ /g, ' ').trim();
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc;
        contentCell.push(p);
      }
    }

    // CTA link.
    const ctaSource = content.querySelector('.terna-slidecontent-item-link a[href], a.terna-link[href]');
    if (ctaSource && ctaSource.getAttribute('href')) {
      const link = document.createElement('a');
      link.setAttribute('href', ctaSource.getAttribute('href'));
      link.textContent = ctaSource.getAttribute('title') || ctaSource.textContent.trim() || 'Read more';
      const p = document.createElement('p');
      p.append(link);
      contentCell.push(p);
    }

    if (image || contentCell.length) {
      cells.push([image || '', contentCell.length ? contentCell : '']);
    }
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-media', cells });
  element.replaceWith(block);
}
