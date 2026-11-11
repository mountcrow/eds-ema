/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-ticker. Base: columns.
 * Source: https://www.terna.it/en (.area--area-1 .teleborsa--wrapper)
 * Structure (from library-description.txt): flexible columns.
 *   Row 1: block name "Columns"
 *   Row 2: one cell per stock stat = label (.teleborsa-key) + value (.teleborsa-val)
 * NOTE: the ticker markup repeats 3x (.animation-content) for the marquee
 *   animation — parse ONLY the first set to avoid duplicates.
 */
export default function parse(element, { document }) {
  // Use only the first repeated animation set; fall back to the element itself.
  const set = element.querySelector('.animation-content') || element;

  const items = Array.from(set.querySelectorAll('.teleborsa-content'));

  const row = [];
  items.forEach((item) => {
    const keyEl = item.querySelector('.teleborsa-key');
    const valEl = item.querySelector('.teleborsa-val');
    const key = keyEl ? keyEl.textContent.trim() : '';
    const val = valEl ? valEl.textContent.trim() : '';
    if (!key && !val) return;

    const cell = [];
    if (key) {
      const label = document.createElement('p');
      label.textContent = key;
      cell.push(label);
    }
    if (val) {
      const value = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = val;
      value.append(strong);
      cell.push(value);
    }
    row.push(cell);
  });

  // Empty-block guard.
  if (!row.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-ticker', cells });
  element.replaceWith(block);
}
