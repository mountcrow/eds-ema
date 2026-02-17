/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns block
 *
 * Source: https://www.kampfkunstschule-fichtner.de/
 * Base Block: columns
 *
 * Block Structure (from block library example):
 * - Row with N cells, one per column
 * - Each cell can contain: text, images, headings, links
 *
 * Source HTML Patterns (from captured DOM):
 * 1. Probetraining columns (section.artikel-video): <div class="row"><div class="col-md-6">text</div><div class="col-md-6">image/video</div></div>
 * 2. Partner logos (section.partner-slider): <div class="owl-mini"><div class="item"><img></div>...</div>
 *
 * Generated: 2026-02-17
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect column structure from Bootstrap grid or owl carousel items
  // VALIDATED: Probetraining uses <div class="col-md-6"> (lines 429-475)
  // VALIDATED: Partner slider uses <div class="item"> inside owl-carousel (lines 972-1021)
  const bootstrapCols = element.querySelectorAll(':scope > [class*="col-"]');
  const owlItems = element.querySelectorAll(':scope > .owl-stage > .owl-item:not(.cloned) > .item, :scope > .owl-item:not(.cloned) > .item');

  if (bootstrapCols.length > 0) {
    // Bootstrap grid columns
    const row = [];
    bootstrapCols.forEach((col) => {
      const colContent = [];

      // Extract headings
      const headings = col.querySelectorAll('h1, h2, h3');
      headings.forEach((h) => colContent.push(h));

      // Extract paragraphs
      const paragraphs = col.querySelectorAll('p');
      paragraphs.forEach((p) => {
        if (p.textContent.trim()) colContent.push(p);
      });

      // Extract links/CTAs
      const links = col.querySelectorAll('a[class*="link-standart"], a[class*="link-custom"], a.btn');
      links.forEach((link) => colContent.push(link));

      // Extract images
      const images = col.querySelectorAll('img');
      images.forEach((img) => colContent.push(img));

      // Extract videos (use poster image or first frame)
      const videos = col.querySelectorAll('video');
      videos.forEach((video) => {
        const poster = video.getAttribute('poster');
        if (poster) {
          const img = document.createElement('img');
          img.src = poster;
          img.alt = 'Video';
          colContent.push(img);
        }
      });

      row.push(colContent);
    });
    cells.push(row);
  } else if (owlItems.length > 0) {
    // Owl carousel items as columns
    const row = [];
    owlItems.forEach((item) => {
      const img = item.querySelector('img');
      const link = item.querySelector('a');

      if (img && link) {
        row.push([link]);
      } else if (img) {
        row.push([img]);
      } else {
        const content = [];
        const allContent = item.querySelectorAll('h1, h2, h3, p, a, img');
        allContent.forEach((el) => content.push(el));
        row.push(content);
      }
    });
    cells.push(row);
  } else {
    // Fallback: treat direct children as columns
    const children = element.querySelectorAll(':scope > div');
    const row = [];
    children.forEach((child) => {
      const content = [];
      const allContent = child.querySelectorAll('h1, h2, h3, p, a, img');
      allContent.forEach((el) => content.push(el));
      row.push(content);
    });
    if (row.length > 0) {
      cells.push(row);
    }
  }

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Columns', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
