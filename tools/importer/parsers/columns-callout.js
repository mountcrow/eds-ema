/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-callout. Base: columns.
 * Sources (https://www.terna.it/en): several editorial callouts —
 *   .area--area-13/-14/-15/-23/-26 .cmp--terna-slidecontent and
 *   .area--area-25 .cmp--custom-html (calendar).
 * Structure (from library-description.txt + block model): 2 columns.
 *   Row 1: block name "Columns"
 *   Row 2: [eyebrow + heading + paragraph + CTA] | [image/media]
 * Source markup: .swiper-slide-content holds
 *   .terna-slidecontent-item-section (eyebrow), .terna-slidecontent-item-title
 *   (heading), .terna-slidecontent-item-text (paragraph),
 *   .terna-slidecontent-item-link a (CTA). Media, when present, is a direct
 *   <img> child of the slide.
 */
export default function parse(element, { document }) {
  // Use the first (active) slide's content; fall back to the element itself.
  // Handles two markups: the standard .terna-slidecontent callout, and the
  // .cmp--custom-html calendar (.calendar-slide) used in area-25.
  const slide = element.querySelector('.swiper-slide, .calendar-slide') || element;
  const content = slide.querySelector('.swiper-slide-content') || slide;

  const contentCell = [];

  // Eyebrow (section label).
  const sectionEl = content.querySelector('.terna-slidecontent-item-section, .calendar-slide__section, [class*="item-section"]');
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

  // Heading.
  const titleEl = content.querySelector('.terna-slidecontent-item-title, .calendar-slide__title, [class*="item-title"]');
  if (titleEl) {
    const titleText = titleEl.textContent.trim();
    if (titleText) {
      const h = document.createElement('h2');
      h.textContent = titleText;
      contentCell.push(h);
    }
  }

  // Paragraph(s): main text and, for the calendar variant, the event date.
  const textEls = Array.from(content.querySelectorAll('.terna-slidecontent-item-text, .calendar-slide__text, .calendar-slide__date, [class*="item-text"]'));
  textEls.forEach((textEl) => {
    const desc = textEl.textContent.replace(/ /g, ' ').replace(/\s+/g, ' ').trim();
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc;
      contentCell.push(p);
    }
  });

  // CTA.
  const ctaSource = content.querySelector('.terna-slidecontent-item-link a[href], .calendar-slide__link-bottom a[href], a.terna-link[href], a[href]');
  if (ctaSource && ctaSource.getAttribute('href')) {
    const link = document.createElement('a');
    link.setAttribute('href', ctaSource.getAttribute('href'));
    link.textContent = ctaSource.getAttribute('title') || ctaSource.textContent.trim() || 'Find out more';
    const p = document.createElement('p');
    p.append(link);
    contentCell.push(p);
  }

  // Media (optional): a direct <img> child of the slide, or any image not inside
  // the text content block.
  let media = Array.from(slide.children).find((c) => c.tagName === 'IMG');
  if (!media) {
    const outsideImg = slide.querySelector(':scope > img, :scope > div > img');
    if (outsideImg && !content.contains(outsideImg)) media = outsideImg;
  }

  // Empty-block guard.
  if (!contentCell.length && !media) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // 2-column row: content | media (media cell padded empty when absent).
  const cells = [[contentCell.length ? contentCell : '', media || '']];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-callout', cells });
  element.replaceWith(block);
}
