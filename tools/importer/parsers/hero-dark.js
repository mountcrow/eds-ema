/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-dark. Base: hero.
 * Source: https://www.terna.it/en (.area--area-28 .cmp--terna-slidecontent)
 * Structure (from library-description.txt): 1 column, 3 rows.
 *   Row 1: block name "Hero"
 *   Row 2: single cell with background image (optional)
 *   Row 3: single cell with eyebrow + heading + paragraph + CTA
 * Source markup: .swiper-slide-content holds .terna-slidecontent-item-section
 *   (eyebrow), .terna-slidecontent-item-title (heading),
 *   .terna-slidecontent-item-text (paragraph, often empty),
 *   .terna-slidecontent-item-link a (CTA). The banner background is CSS-driven,
 *   so no DOM <img> is typically present.
 */
export default function parse(element, { document }) {
  const slide = element.querySelector('.swiper-slide') || element;
  const content = slide.querySelector('.swiper-slide-content') || slide;

  const cells = [];

  // Row 2: background image (optional) — a direct <img> child of the slide.
  let bgImage = Array.from(slide.children).find((c) => c.tagName === 'IMG');
  if (!bgImage) {
    const img = slide.querySelector(':scope > img, :scope > div > img');
    if (img && !content.contains(img)) bgImage = img;
  }
  if (bgImage) cells.push([bgImage]);

  // Row 3: text content (single cell).
  const contentCell = [];

  const sectionEl = content.querySelector('.terna-slidecontent-item-section, [class*="item-section"]');
  if (sectionEl) {
    const eyebrowText = sectionEl.textContent.trim();
    if (eyebrowText) {
      const eyebrow = document.createElement('p');
      const em = document.createElement('em');
      em.textContent = eyebrowText;
      eyebrow.append(em);
      contentCell.push(eyebrow);
    }
  }

  const titleEl = content.querySelector('.terna-slidecontent-item-title, [class*="item-title"]');
  const titleText = titleEl ? titleEl.textContent.trim() : '';
  if (titleText) {
    const h = document.createElement('h1');
    h.textContent = titleText;
    contentCell.push(h);
  }

  const textEl = content.querySelector('.terna-slidecontent-item-text, [class*="item-text"]');
  if (textEl) {
    const desc = textEl.textContent.replace(/ /g, ' ').trim();
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc;
      contentCell.push(p);
    }
  }

  const ctaSource = content.querySelector('.terna-slidecontent-item-link a[href], a.terna-link[href], a[href]');
  if (ctaSource && ctaSource.getAttribute('href')) {
    const link = document.createElement('a');
    link.setAttribute('href', ctaSource.getAttribute('href'));
    link.textContent = ctaSource.getAttribute('title') || ctaSource.textContent.trim() || 'Find out more';
    const p = document.createElement('p');
    p.append(link);
    contentCell.push(p);
  }

  // Empty-block guard.
  if (!contentCell.length && !cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  if (contentCell.length) cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-dark', cells });
  element.replaceWith(block);
}
