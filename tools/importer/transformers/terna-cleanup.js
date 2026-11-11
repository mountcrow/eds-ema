/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Terna site-wide cleanup.
 *
 * Removes non-authorable global chrome (cookie consent, header, main nav/menu,
 * footer) and leftover scaffolding so only page-level body content inside
 * `.layout__internal-container` is imported. Header/nav and footer are handled
 * by separate migration workflows.
 *
 * All selectors verified against migration-work/cleaned.html:
 *   - #CybotCookiebotDialog / #CybotCookiebotDialogBodyUnderlay  (cookie consent)  line 2
 *   - .skip-nav                                                   line 1064
 *   - .terna-menu                                                 line 1063
 *   - .terna-header                                               line 1066
 *   - #navigation / .terna-menu-layer                             line 1086
 *   - .mainFooter                                                 line 3653
 *   - <link> stylesheets embedded in content areas                lines 2912, 3292
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent dialog / overlay — blocks parsing, remove first.
    WebImporter.DOMUtils.remove(element, [
      '#CybotCookiebotDialog',
      '#CybotCookiebotDialogBodyUnderlay',
      '#CybotCookiebotDialogPoweredByText',
      '[id^="CybotCookiebot"]',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Non-authorable global chrome: header, main nav/menu, skip-nav, footer.
    // Handled by separate header/footer workflows, so strip from body import.
    WebImporter.DOMUtils.remove(element, [
      '.skip-nav',
      '.terna-menu',
      '.terna-header',
      '#navigation',
      '.terna-menu-layer',
      '.mainFooter',
    ]);

    // Leftover scaffolding: embedded stylesheet links and no-render elements.
    WebImporter.DOMUtils.remove(element, [
      'link',
      'noscript',
      'style',
    ]);
  }
}
