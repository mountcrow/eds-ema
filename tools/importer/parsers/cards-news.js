/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-news. Base: cards (no images variant).
 * Sources (https://www.terna.it/en):
 *   .area--area-4 .cmp--terna-documentlistcover        (press releases)
 *   .area--area-24 .cmp--terna-documentlistcoverarchivio (financial info)
 *   .area--area-27 .cmp--terna-documentlistcover        (operator news)
 * Structure (from library-description.txt): 1 column, multiple rows.
 *   Row 1: block name "Cards (no images)"
 *   Each subsequent row = single cell with title (heading + link) + date + optional CTA.
 * Source markup: .terna-documentlistcover-item (usually a .swiper-slide) with
 *   a.item-title (href + title), .item-date. The .item-link is a social-share
 *   widget, not a content CTA — excluded.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each card item. Cover various DNN list markups.
  let items = Array.from(element.querySelectorAll('.terna-documentlistcover-item, .swiper-slide'));
  // De-duplicate: swiper clones share the same content; keep unique by title href/text.
  if (!items.length) {
    items = Array.from(element.querySelectorAll('.item-content'));
  }

  const seen = new Set();

  items.forEach((item) => {
    const titleLink = item.querySelector('a.item-title, .item-title a, a[class*="title"]');
    const titleContainer = item.querySelector('.item-title, [class*="item-title"]');
    const dateEl = item.querySelector('.item-date, [class*="date"]');

    const href = titleLink ? titleLink.getAttribute('href') : null;
    const titleText = (titleLink || titleContainer)
      ? (titleLink || titleContainer).textContent.trim()
      : '';

    if (!titleText) return;

    // De-duplicate swiper clones.
    const key = (href || '') + '|' + titleText;
    if (seen.has(key)) return;
    seen.add(key);

    const cell = [];

    // Title as a heading; wrap in a link if there's an href.
    const heading = document.createElement('h3');
    if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = titleText;
      heading.append(link);
    } else {
      heading.textContent = titleText;
    }
    cell.push(heading);

    // Date.
    if (dateEl) {
      const dateText = dateEl.textContent.trim();
      if (dateText) {
        const p = document.createElement('p');
        p.textContent = dateText;
        cell.push(p);
      }
    }

    cells.push([cell]);
  });

  // Empty-block guard.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
