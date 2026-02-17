/* eslint-disable */
/* global WebImporter */

/**
 * Transformer for Kampfkunstschule Fichtner website cleanup
 * Purpose: Remove non-content elements, cookie banners, navigation, footer, and tracking widgets
 * Applies to: www.kampfkunstschule-fichtner.de (all templates)
 * Generated: 2026-02-17
 *
 * SELECTORS EXTRACTED FROM:
 * - Captured DOM during migration workflow (cleaned.html)
 * - Page structure analysis from page migration
 */

const TransformHook = {
  beforeTransform: 'beforeTransform',
  afterTransform: 'afterTransform',
};

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent banner
    // EXTRACTED: Found <div class="popup popup__cookie"> in captured DOM (line 1377)
    // EXTRACTED: Found <div id="cookiehint"> and <div id="cookiesettings"> in captured DOM
    WebImporter.DOMUtils.remove(element, [
      '.popup__cookie',
      '#cookiehint',
      '#cookiesettings',
    ]);

    // Remove navigation and header
    // EXTRACTED: Found <div class="topheader"> in captured DOM (line 2)
    // EXTRACTED: Found <nav class="navbar"> in captured DOM (line 18)
    WebImporter.DOMUtils.remove(element, [
      '.topheader',
      'nav.navbar',
    ]);

    // Remove footer
    // EXTRACTED: Found <div class="footer"> in captured DOM (line 1231)
    WebImporter.DOMUtils.remove(element, [
      '.footer',
    ]);

    // Remove side buttons (shop links)
    // EXTRACTED: Found <div class="sidebtns"> in captured DOM (line 1205)
    WebImporter.DOMUtils.remove(element, [
      '.sidebtns',
    ]);

    // Remove bottom navigation buttons
    // EXTRACTED: Found <div class="botton_btns"> in captured DOM (line 1214)
    WebImporter.DOMUtils.remove(element, [
      '.botton_btns',
    ]);

    // Remove modal dialogs
    // EXTRACTED: Found <div class="modal fade" id="exampleModal"> in captured DOM (line 1278)
    WebImporter.DOMUtils.remove(element, [
      '.modal',
    ]);

    // Re-enable scrolling if hidden by cookie popup
    // EXTRACTED: body class "hasPopup" in captured DOM (line 1)
    if (element.classList && element.classList.contains('hasPopup')) {
      element.classList.remove('hasPopup');
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove remaining non-content elements
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'link',
      'noscript',
      'source',
    ]);

    // Remove form elements (event signup forms embedded in cards)
    // EXTRACTED: Found multiple <form> elements inside event cards in captured DOM
    WebImporter.DOMUtils.remove(element, [
      'form',
    ]);

    // Remove owl carousel cloned items (duplicates)
    // EXTRACTED: Found <div class="owl-item cloned"> in captured DOM (lines 847, 861, etc.)
    WebImporter.DOMUtils.remove(element, [
      '.owl-item.cloned',
      '.owl-nav',
      '.owl-dots',
    ]);
  }
}
