/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero block
 *
 * Source: https://www.kampfkunstschule-fichtner.de/
 * Base Block: hero
 *
 * Block Structure (from block library example):
 * - Row 1: Background image (optional)
 * - Row 2: Content (heading, text, CTA)
 *
 * Source HTML Pattern (from captured DOM):
 * <div class="claim">
 *   <h1 class="animate__animated">Heading</h1>
 *   <div class="animate__animated">
 *     <p>Description text</p>
 *   </div>
 *   <a href="..." class="link-standart-black link-custom-red">CTA</a>
 * </div>
 *
 * Generated: 2026-02-17
 */
export default function parse(element, { document }) {
  // Extract heading from the claim section
  // VALIDATED: Found <h1 class="animate__animated animate__fadeInDown"> in captured DOM (line 103)
  const heading = element.querySelector('h1') ||
                  element.querySelector('h2') ||
                  element.querySelector('[class*="title"]');

  // Extract description text
  // VALIDATED: Found <div class="animate__animated animate__fadeInUp"> containing <p> elements (line 104-109)
  const descDiv = element.querySelector('.animate__animated:not(h1):not(a)');
  const descriptions = descDiv
    ? Array.from(descDiv.querySelectorAll('p'))
    : Array.from(element.querySelectorAll('p'));

  // Extract CTA link
  // VALIDATED: Found <a class="link-standart-black link-custom-red"> in captured DOM (line 110)
  const ctaLinks = Array.from(element.querySelectorAll('a[class*="link-standart"], a[class*="link-custom"]'));

  // Check for a background image (video poster or nearby image)
  // The original uses a video background - use the first available image as fallback
  const bgImage = element.querySelector('img') ||
                  element.parentElement?.querySelector('video + div img, img');

  // Build cells array matching hero block markdown structure
  const cells = [];

  // Row 1: Background image (optional)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content cell (heading + descriptions + CTAs)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  descriptions.forEach((p) => {
    if (p.textContent.trim()) contentCell.push(p);
  });
  ctaLinks.forEach((cta) => contentCell.push(cta));

  cells.push(contentCell);

  // Create block using WebImporter utility
  const block = WebImporter.Blocks.createBlock(document, { name: 'Hero', cells });

  // Replace original element with structured block table
  element.replaceWith(block);
}
