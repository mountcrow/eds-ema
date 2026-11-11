/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Terna section breaks + Section Metadata.
 *
 * Uses `payload.template.sections` from page-templates.json to insert section
 * breaks (`<hr>`) between sections and Section Metadata blocks for sections
 * that declare a `style`.
 *
 * Section selectors are the `.area--area-N` classes from the template, all
 * verified present in migration-work/cleaned.html.
 *
 * Rules:
 *   - Process sections in reverse order so inserted nodes don't shift later
 *     section elements.
 *   - Insert an `<hr>` before every section except the first.
 *   - For each section with a truthy `style`, append a Section Metadata block
 *     after the section element.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const sections = (payload && payload.template && payload.template.sections) || [];
    if (!sections.length) return;

    const doc = element.ownerDocument;

    // Reverse order keeps earlier section element references stable.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.selector) continue;

      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Section Metadata block after the section, when a style is declared.
      if (section.style) {
        const metadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metadata);
      }

      // Section break before every non-first section.
      if (i > 0) {
        sectionEl.before(doc.createElement('hr'));
      }
    }
  }
}
