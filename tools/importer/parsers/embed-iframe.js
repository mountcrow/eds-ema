/* eslint-disable */
/* global WebImporter */
/**
 * Parser for embed-iframe. Base: embed.
 * Source: https://www.terna.it/en (.area--area-3 .cmp--terna-iframe)
 * Structure (from library-description.txt): 1 column, 2 rows.
 *   Row 1: block name "Embed"
 *   Row 2: single cell containing the external URL (the iframe src).
 */
export default function parse(element, { document }) {
  const iframe = element.querySelector('iframe[src], iframe[data-src]');
  const src = iframe
    ? (iframe.getAttribute('src') || iframe.getAttribute('data-src'))
    : null;

  // Empty-block guard: no embeddable URL.
  if (!src) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Single cell containing a link to the embedded URL.
  const link = document.createElement('a');
  link.setAttribute('href', src);
  link.textContent = src;

  const cells = [[link]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-iframe', cells });
  element.replaceWith(block);
}
