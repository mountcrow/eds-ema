/* eslint-disable */
/* global WebImporter */
/**
 * Parser for tabs-kpi. Base: tabs.
 * Source: https://www.terna.it/en (.area--area-32 #kpiApp)
 * Structure (from library-description.txt): 2 columns, multiple rows.
 *   Row 1: block name "Tabs"
 *   Each subsequent row = [tab label] | [tab panel content]
 * Source markup ("KPI Highlights" swiper): each .kpi-swiper--slide is one tab:
 *   h3.kpi-slide--title        -> tab label
 *   p.kpi-slide--subtitle      -> panel subtitle (e.g. "as of 31 december 2025")
 *   article.kpi-slide--wrapper > .kpi-slide--content -> stat cards (h2 number + p label)
 * The trailing "Find out more" link (a.kpi-swiper--link) is appended to the last panel.
 * `da` project (no field hinting).
 */
export default function parse(element, { document }) {
  const blockName = 'tabs-kpi';

  // Each swiper slide is one tab. Fall back to .kpi-slide only where no outer slide exists.
  const slides = Array.from(element.querySelectorAll('.kpi-swiper--slide'));
  const slideList = slides.length
    ? slides
    : Array.from(element.querySelectorAll('.kpi-slide'));

  // Trailing "Find out more" link (sibling of slides, not inside a slide panel).
  const moreLink = element.querySelector('a.kpi-swiper--link, .kpi-swiper--link a');

  const cells = [];
  // Row 1: block name only.
  cells.push([blockName]);

  slideList.forEach((slide, index) => {
    const slideRoot = slide.querySelector(':scope .kpi-slide') || slide;

    // Tab label from the slide title.
    const titleEl = slideRoot.querySelector('.kpi-slide--title, h3, h2, h4');
    const label = titleEl ? titleEl.textContent.trim() : `Tab ${index + 1}`;

    // Panel content: subtitle + stat cards.
    const panelContent = [];

    const subtitle = slideRoot.querySelector('.kpi-slide--subtitle');
    if (subtitle && subtitle.textContent.trim()) {
      const p = document.createElement('p');
      p.append(...subtitle.cloneNode(true).childNodes);
      panelContent.push(p);
    }

    const statCards = Array.from(slideRoot.querySelectorAll(
      '.kpi-slide--wrapper .kpi-slide--content',
    ));
    const cardScope = statCards.length
      ? statCards
      : Array.from(slideRoot.querySelectorAll('.kpi-slide--wrapper > div'));

    cardScope.forEach((card) => {
      const number = card.querySelector('h2, h1, h3, h4, [class*="number"]');
      const desc = card.querySelector('p');
      if (number && number.textContent.trim()) {
        const h = document.createElement('h3');
        h.textContent = number.textContent.trim();
        panelContent.push(h);
      }
      if (desc && desc.textContent.trim()) {
        const p = document.createElement('p');
        p.append(...desc.cloneNode(true).childNodes);
        panelContent.push(p);
      }
    });

    // Append the "Find out more" link to the last panel.
    if (moreLink && index === slideList.length - 1) {
      const linkP = document.createElement('p');
      const a = document.createElement('a');
      a.href = moreLink.getAttribute('href') || '#';
      const linkTitle = moreLink.getAttribute('title');
      if (linkTitle) a.title = linkTitle;
      a.textContent = moreLink.textContent.trim() || 'Find out more';
      linkP.append(a);
      panelContent.push(linkP);
    }

    cells.push([label, panelContent.length ? panelContent : '']);
  });

  // Empty-block guard: no slides found -> unwrap.
  if (slideList.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: blockName, cells });
  element.replaceWith(block);
}
