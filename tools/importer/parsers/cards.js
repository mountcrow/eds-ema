/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards block
 *
 * Source: https://www.kampfkunstschule-fichtner.de/
 * Base Block: cards
 *
 * Block Structure (from block library example):
 * - Row per card: [Image cell | Text cell (title, description, CTA)]
 * - For cards without images: [Text cell (title, description)]
 *
 * Source HTML Patterns (from captured DOM):
 * 1. Program cards (section.bild_leiste): <div class="outter"><img><h1><p><a></div>
 * 2. Event cards (section.events): <div class="event-..."><h2><p></div>
 * 3. Location cards (section.standort-slider): <div class="item"><a><img><h1></a></div>
 *
 * Generated: 2026-02-17
 */
export default function parse(element, { document }) {
  // Determine which type of cards we're dealing with based on DOM context
  const cells = [];

  // Try to find individual card items within the element
  // VALIDATED: Program cards use <div class="outter"> (line 315-385)
  // VALIDATED: Event cards use <div class="event-..."> or <div class="col-md-4"> within rows
  // VALIDATED: Location cards use <div class="item"> inside owl-carousel (line 847-940)
  const cardItems = element.querySelectorAll(':scope > div.outter, :scope > div[class*="event"], :scope > .owl-stage > .owl-item:not(.cloned) > .item, :scope > div[class*="col-"]');

  if (cardItems.length > 0) {
    cardItems.forEach((card) => {
      const img = card.querySelector('img');
      const title = card.querySelector('h1, h2, h3, strong, [class*="title"]');
      const desc = card.querySelector('p:not(:empty), [class*="desc"]');
      const link = card.querySelector('a[class*="link"], a[href]:not([href="#"])');

      if (img) {
        // Cards with images - two column layout
        const textContent = [];
        if (title) textContent.push(title);
        if (desc) textContent.push(desc);
        if (link && (!title || !link.contains(title))) textContent.push(link);
        cells.push([img, textContent]);
      } else {
        // Cards without images - single column layout
        const textContent = [];
        if (title) textContent.push(title);
        if (desc) textContent.push(desc);
        if (link) textContent.push(link);
        cells.push([textContent]);
      }
    });
  } else {
    // Fallback: treat direct children as cards
    const children = element.querySelectorAll(':scope > div, :scope > article');
    children.forEach((child) => {
      const img = child.querySelector('img');
      const title = child.querySelector('h1, h2, h3, strong');
      const desc = child.querySelector('p');
      const link = child.querySelector('a[href]:not([href="#"])');

      if (img) {
        const textContent = [];
        if (title) textContent.push(title);
        if (desc) textContent.push(desc);
        if (link) textContent.push(link);
        cells.push([img, textContent]);
      } else {
        const textContent = [];
        if (title) textContent.push(title);
        if (desc) textContent.push(desc);
        if (link) textContent.push(link);
        cells.push([textContent]);
      }
    });
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Cards', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
