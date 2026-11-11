/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import columnsTickerParser from './parsers/columns-ticker.js';
import embedIframeParser from './parsers/embed-iframe.js';
import cardsNewsParser from './parsers/cards-news.js';
import cardsMediaParser from './parsers/cards-media.js';
import columnsCalloutParser from './parsers/columns-callout.js';
import heroDarkParser from './parsers/hero-dark.js';
import tabsKpiParser from './parsers/tabs-kpi.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/terna-cleanup.js';
import sectionsTransformer from './transformers/terna-sections.js';

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Terna corporate homepage with hero slider, stock ticker, press releases, blog cards, editorial callouts, financial info, calendar, operator news, KPI highlights, and promo cards.',
  urls: [
    'https://www.terna.it/en',
  ],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.area--area-1 #swiperContainer'],
    },
    {
      name: 'columns-ticker',
      instances: ['.area--area-1 .teleborsa--wrapper'],
    },
    {
      name: 'embed-iframe',
      instances: ['.area--area-3 .cmp--terna-iframe'],
    },
    {
      name: 'cards-news',
      instances: [
        '.area--area-4 .cmp--terna-documentlistcover',
        '.area--area-24 .cmp--terna-documentlistcoverarchivio',
        '.area--area-27 .cmp--terna-documentlistcover',
      ],
    },
    {
      name: 'cards-media',
      instances: [
        '.area--area-5 .cmp--terna-slidecontent',
        '.area--area-32 .cmp--terna-slidecontent',
      ],
    },
    {
      name: 'columns-callout',
      instances: [
        '.area--area-13 .cmp--terna-slidecontent',
        '.area--area-14 .cmp--terna-slidecontent',
        '.area--area-15 .cmp--terna-slidecontent',
        '.area--area-23 .cmp--terna-slidecontent',
        '.area--area-25 .cmp--custom-html',
        '.area--area-26 .cmp--terna-slidecontent',
      ],
    },
    {
      name: 'hero-dark',
      instances: ['.area--area-28 .cmp--terna-slidecontent'],
    },
    {
      name: 'tabs-kpi',
      instances: ['.area--area-32 #kpiApp'],
    },
  ],
  sections: [
    { id: 'sec-hero', name: 'Hero slider + ticker', selector: '.area--area-1', style: null, blocks: ['carousel-hero', 'columns-ticker'], defaultContent: [] },
    { id: 'sec-realtime-demand', name: 'Realtime Electricity Demand', selector: '.area--area-3', style: 'light', blocks: ['embed-iframe'], defaultContent: [] },
    { id: 'sec-press-releases', name: 'Press Releases', selector: '.area--area-4', style: 'light', blocks: ['cards-news'], defaultContent: [] },
    { id: 'sec-blog-cards', name: 'Blog cards', selector: '.area--area-5', style: 'light', blocks: ['cards-media'], defaultContent: [] },
    { id: 'sec-callout-behind-energy', name: 'We are behind the energy', selector: '.area--area-9', style: 'light', blocks: [], defaultContent: ['.area--area-9 .cmp--website-boxevidence'] },
    { id: 'sec-callout-sustainability', name: 'Sustainability callout', selector: '.area--area-13', style: 'light', blocks: ['columns-callout'], defaultContent: [] },
    { id: 'sec-callout-innovation', name: 'Innovation callout', selector: '.area--area-14', style: 'light', blocks: ['columns-callout'], defaultContent: [] },
    { id: 'sec-callout-electricity-system', name: 'Electricity System callout', selector: '.area--area-15', style: 'light', blocks: ['columns-callout'], defaultContent: [] },
    { id: 'sec-callout-2025-results', name: '2025 Results callout', selector: '.area--area-23', style: 'light', blocks: ['columns-callout'], defaultContent: [] },
    { id: 'sec-financial-info', name: 'Financial Info', selector: '.area--area-24', style: 'light', blocks: ['cards-news'], defaultContent: [] },
    { id: 'sec-calendar', name: 'Calendar', selector: '.area--area-25', style: 'light', blocks: ['columns-callout'], defaultContent: [] },
    { id: 'sec-callout-regional-planning', name: 'Efficient Regional Planning callout', selector: '.area--area-26', style: 'light', blocks: ['columns-callout'], defaultContent: [] },
    { id: 'sec-operator-news', name: 'Operator News', selector: '.area--area-27', style: 'light', blocks: ['cards-news'], defaultContent: [] },
    { id: 'sec-callout-behind-projects', name: 'Behind our projects (dark)', selector: '.area--area-28', style: 'dark', blocks: ['hero-dark'], defaultContent: [] },
    { id: 'sec-kpi-and-promos', name: 'KPI Highlights + promo cards', selector: '.area--area-32', style: 'light', blocks: ['tabs-kpi', 'cards-media'], defaultContent: [] },
  ],
};

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'columns-ticker': columnsTickerParser,
  'embed-iframe': embedIframeParser,
  'cards-news': cardsNewsParser,
  'cards-media': cardsMediaParser,
  'columns-callout': columnsCalloutParser,
  'hero-dark': heroDarkParser,
  'tabs-kpi': tabsKpiParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // already replaced by earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
