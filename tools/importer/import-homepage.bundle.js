/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const cells = [];
    const slides = Array.from(element.querySelectorAll(".swiper-slide"));
    slides.forEach((slide) => {
      const imgEl = slide.querySelector('img.swiper-slide-image, img[class*="slide-image"]');
      let image = null;
      if (imgEl) {
        const realSrc = imgEl.getAttribute("src") || imgEl.getAttribute("data-src") || imgEl.getAttribute("data-original") || imgEl.getAttribute("data-lazy");
        if (realSrc && !realSrc.startsWith("data:")) {
          image = document.createElement("img");
          image.setAttribute("src", realSrc);
          if (imgEl.getAttribute("alt")) image.setAttribute("alt", imgEl.getAttribute("alt"));
        } else if (realSrc) {
          image = imgEl;
        }
      }
      const contentCell = [];
      const titleEl = slide.querySelector(".item-title");
      if (titleEl) {
        const titleText = titleEl.textContent.trim();
        if (titleText) {
          const h = document.createElement("h2");
          h.textContent = titleText;
          contentCell.push(h);
        }
      }
      const textEl = slide.querySelector(".item-text");
      if (textEl) {
        const p = document.createElement("p");
        p.textContent = textEl.textContent.trim();
        if (p.textContent) contentCell.push(p);
      }
      const ctaSource = slide.querySelector(".item-link a[href]") || slide.querySelector("a.overlay-link[href]") || slide.querySelector("a.play-btn[href]");
      if (ctaSource && ctaSource.getAttribute("href")) {
        const link = document.createElement("a");
        link.setAttribute("href", ctaSource.getAttribute("href"));
        const label = ctaSource.getAttribute("title") || ctaSource.textContent.trim() || "Find out more";
        link.textContent = label;
        const p = document.createElement("p");
        p.append(link);
        contentCell.push(p);
      }
      if (image || contentCell.length) {
        cells.push([image || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-ticker.js
  function parse2(element, { document }) {
    const set = element.querySelector(".animation-content") || element;
    const items = Array.from(set.querySelectorAll(".teleborsa-content"));
    const row = [];
    items.forEach((item) => {
      const keyEl = item.querySelector(".teleborsa-key");
      const valEl = item.querySelector(".teleborsa-val");
      const key = keyEl ? keyEl.textContent.trim() : "";
      const val = valEl ? valEl.textContent.trim() : "";
      if (!key && !val) return;
      const cell = [];
      if (key) {
        const label = document.createElement("p");
        label.textContent = key;
        cell.push(label);
      }
      if (val) {
        const value = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = val;
        value.append(strong);
        cell.push(value);
      }
      row.push(cell);
    });
    if (!row.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-ticker", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-iframe.js
  function parse3(element, { document }) {
    const iframe = element.querySelector("iframe[src], iframe[data-src]");
    const src = iframe ? iframe.getAttribute("src") || iframe.getAttribute("data-src") : null;
    if (!src) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const link = document.createElement("a");
    link.setAttribute("href", src);
    link.textContent = src;
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-iframe", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse4(element, { document }) {
    const cells = [];
    let items = Array.from(element.querySelectorAll(".terna-documentlistcover-item, .swiper-slide"));
    if (!items.length) {
      items = Array.from(element.querySelectorAll(".item-content"));
    }
    const seen = /* @__PURE__ */ new Set();
    items.forEach((item) => {
      const titleLink = item.querySelector('a.item-title, .item-title a, a[class*="title"]');
      const titleContainer = item.querySelector('.item-title, [class*="item-title"]');
      const dateEl = item.querySelector('.item-date, [class*="date"]');
      const href = titleLink ? titleLink.getAttribute("href") : null;
      const titleText = titleLink || titleContainer ? (titleLink || titleContainer).textContent.trim() : "";
      if (!titleText) return;
      const key = (href || "") + "|" + titleText;
      if (seen.has(key)) return;
      seen.add(key);
      const cell = [];
      const heading = document.createElement("h3");
      if (href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = titleText;
        heading.append(link);
      } else {
        heading.textContent = titleText;
      }
      cell.push(heading);
      if (dateEl) {
        const dateText = dateEl.textContent.trim();
        if (dateText) {
          const p = document.createElement("p");
          p.textContent = dateText;
          cell.push(p);
        }
      }
      cells.push([cell]);
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-media.js
  function parse5(element, { document }) {
    const cells = [];
    const seen = /* @__PURE__ */ new Set();
    const slides = Array.from(element.querySelectorAll(".swiper-slide"));
    slides.forEach((slide) => {
      let image = Array.from(slide.children).find((c) => c.tagName === "IMG") || slide.querySelector(":scope > img");
      const content = slide.querySelector(".swiper-slide-content") || slide;
      const titleEl = content.querySelector('.terna-slidecontent-item-title, [class*="item-title"]:not(a)');
      const titleText = titleEl ? titleEl.textContent.trim() : "";
      const imgSrc = image ? image.getAttribute("src") || image.getAttribute("data-src") || "" : "";
      const key = titleText + "|" + imgSrc;
      if (titleText && seen.has(key)) return;
      if (titleText) seen.add(key);
      const contentCell = [];
      const eyebrowLink = content.querySelector(".terna-slidecontent-item-section a, a.item-title");
      if (eyebrowLink) {
        const eyebrowText = eyebrowLink.getAttribute("title") || (eyebrowLink.querySelector("img") ? eyebrowLink.querySelector("img").getAttribute("alt") : "") || eyebrowLink.textContent.trim();
        if (eyebrowText) {
          const eyebrow = document.createElement("p");
          const em = document.createElement("em");
          em.textContent = eyebrowText;
          eyebrow.append(em);
          contentCell.push(eyebrow);
        }
      }
      if (titleText) {
        const h = document.createElement("h3");
        h.textContent = titleText;
        contentCell.push(h);
      }
      const textEl = content.querySelector('.terna-slidecontent-item-text, [class*="item-text"]');
      if (textEl) {
        const desc = textEl.textContent.replace(/ /g, " ").trim();
        if (desc) {
          const p = document.createElement("p");
          p.textContent = desc;
          contentCell.push(p);
        }
      }
      const ctaSource = content.querySelector(".terna-slidecontent-item-link a[href], a.terna-link[href]");
      if (ctaSource && ctaSource.getAttribute("href")) {
        const link = document.createElement("a");
        link.setAttribute("href", ctaSource.getAttribute("href"));
        link.textContent = ctaSource.getAttribute("title") || ctaSource.textContent.trim() || "Read more";
        const p = document.createElement("p");
        p.append(link);
        contentCell.push(p);
      }
      if (image || contentCell.length) {
        cells.push([image || "", contentCell.length ? contentCell : ""]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-callout.js
  function parse6(element, { document }) {
    const slide = element.querySelector(".swiper-slide, .calendar-slide") || element;
    const content = slide.querySelector(".swiper-slide-content") || slide;
    const contentCell = [];
    const sectionEl = content.querySelector('.terna-slidecontent-item-section, .calendar-slide__section, [class*="item-section"]');
    if (sectionEl) {
      const eyebrowText = sectionEl.textContent.trim();
      if (eyebrowText) {
        const eyebrow = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = eyebrowText;
        eyebrow.append(em);
        contentCell.push(eyebrow);
      }
    }
    const titleEl = content.querySelector('.terna-slidecontent-item-title, .calendar-slide__title, [class*="item-title"]');
    if (titleEl) {
      const titleText = titleEl.textContent.trim();
      if (titleText) {
        const h = document.createElement("h2");
        h.textContent = titleText;
        contentCell.push(h);
      }
    }
    const textEls = Array.from(content.querySelectorAll('.terna-slidecontent-item-text, .calendar-slide__text, .calendar-slide__date, [class*="item-text"]'));
    textEls.forEach((textEl) => {
      const desc = textEl.textContent.replace(/ /g, " ").replace(/\s+/g, " ").trim();
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc;
        contentCell.push(p);
      }
    });
    const ctaSource = content.querySelector(".terna-slidecontent-item-link a[href], .calendar-slide__link-bottom a[href], a.terna-link[href], a[href]");
    if (ctaSource && ctaSource.getAttribute("href")) {
      const link = document.createElement("a");
      link.setAttribute("href", ctaSource.getAttribute("href"));
      link.textContent = ctaSource.getAttribute("title") || ctaSource.textContent.trim() || "Find out more";
      const p = document.createElement("p");
      p.append(link);
      contentCell.push(p);
    }
    let media = Array.from(slide.children).find((c) => c.tagName === "IMG");
    if (!media) {
      const outsideImg = slide.querySelector(":scope > img, :scope > div > img");
      if (outsideImg && !content.contains(outsideImg)) media = outsideImg;
    }
    if (!contentCell.length && !media) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[contentCell.length ? contentCell : "", media || ""]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-callout", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-dark.js
  function parse7(element, { document }) {
    const slide = element.querySelector(".swiper-slide") || element;
    const content = slide.querySelector(".swiper-slide-content") || slide;
    const cells = [];
    let bgImage = Array.from(slide.children).find((c) => c.tagName === "IMG");
    if (!bgImage) {
      const img = slide.querySelector(":scope > img, :scope > div > img");
      if (img && !content.contains(img)) bgImage = img;
    }
    if (bgImage) cells.push([bgImage]);
    const contentCell = [];
    const sectionEl = content.querySelector('.terna-slidecontent-item-section, [class*="item-section"]');
    if (sectionEl) {
      const eyebrowText = sectionEl.textContent.trim();
      if (eyebrowText) {
        const eyebrow = document.createElement("p");
        const em = document.createElement("em");
        em.textContent = eyebrowText;
        eyebrow.append(em);
        contentCell.push(eyebrow);
      }
    }
    const titleEl = content.querySelector('.terna-slidecontent-item-title, [class*="item-title"]');
    const titleText = titleEl ? titleEl.textContent.trim() : "";
    if (titleText) {
      const h = document.createElement("h1");
      h.textContent = titleText;
      contentCell.push(h);
    }
    const textEl = content.querySelector('.terna-slidecontent-item-text, [class*="item-text"]');
    if (textEl) {
      const desc = textEl.textContent.replace(/ /g, " ").trim();
      if (desc) {
        const p = document.createElement("p");
        p.textContent = desc;
        contentCell.push(p);
      }
    }
    const ctaSource = content.querySelector(".terna-slidecontent-item-link a[href], a.terna-link[href], a[href]");
    if (ctaSource && ctaSource.getAttribute("href")) {
      const link = document.createElement("a");
      link.setAttribute("href", ctaSource.getAttribute("href"));
      link.textContent = ctaSource.getAttribute("title") || ctaSource.textContent.trim() || "Find out more";
      const p = document.createElement("p");
      p.append(link);
      contentCell.push(p);
    }
    if (!contentCell.length && !cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    if (contentCell.length) cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-dark", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-kpi.js
  function parse8(element, { document }) {
    const blockName = "tabs-kpi";
    const slides = Array.from(element.querySelectorAll(".kpi-swiper--slide"));
    const slideList = slides.length ? slides : Array.from(element.querySelectorAll(".kpi-slide"));
    const moreLink = element.querySelector("a.kpi-swiper--link, .kpi-swiper--link a");
    const cells = [];
    cells.push([blockName]);
    slideList.forEach((slide, index) => {
      const slideRoot = slide.querySelector(":scope .kpi-slide") || slide;
      const titleEl = slideRoot.querySelector(".kpi-slide--title, h3, h2, h4");
      const label = titleEl ? titleEl.textContent.trim() : `Tab ${index + 1}`;
      const panelContent = [];
      const subtitle = slideRoot.querySelector(".kpi-slide--subtitle");
      if (subtitle && subtitle.textContent.trim()) {
        const p = document.createElement("p");
        p.append(...subtitle.cloneNode(true).childNodes);
        panelContent.push(p);
      }
      const statCards = Array.from(slideRoot.querySelectorAll(
        ".kpi-slide--wrapper .kpi-slide--content"
      ));
      const cardScope = statCards.length ? statCards : Array.from(slideRoot.querySelectorAll(".kpi-slide--wrapper > div"));
      cardScope.forEach((card) => {
        const number = card.querySelector('h2, h1, h3, h4, [class*="number"]');
        const desc = card.querySelector("p");
        if (number && number.textContent.trim()) {
          const h = document.createElement("h3");
          h.textContent = number.textContent.trim();
          panelContent.push(h);
        }
        if (desc && desc.textContent.trim()) {
          const p = document.createElement("p");
          p.append(...desc.cloneNode(true).childNodes);
          panelContent.push(p);
        }
      });
      if (moreLink && index === slideList.length - 1) {
        const linkP = document.createElement("p");
        const a = document.createElement("a");
        a.href = moreLink.getAttribute("href") || "#";
        const linkTitle = moreLink.getAttribute("title");
        if (linkTitle) a.title = linkTitle;
        a.textContent = moreLink.textContent.trim() || "Find out more";
        linkP.append(a);
        panelContent.push(linkP);
      }
      cells.push([label, panelContent.length ? panelContent : ""]);
    });
    if (slideList.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: blockName, cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/terna-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#CybotCookiebotDialog",
        "#CybotCookiebotDialogBodyUnderlay",
        "#CybotCookiebotDialogPoweredByText",
        '[id^="CybotCookiebot"]'
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".skip-nav",
        ".terna-menu",
        ".terna-header",
        "#navigation",
        ".terna-menu-layer",
        ".mainFooter"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "link",
        "noscript",
        "style"
      ]);
    }
  }

  // tools/importer/transformers/terna-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const sections = payload && payload.template && payload.template.sections || [];
      if (!sections.length) return;
      const doc = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section || !section.selector) continue;
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const metadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metadata);
        }
        if (i > 0) {
          sectionEl.before(doc.createElement("hr"));
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Terna corporate homepage with hero slider, stock ticker, press releases, blog cards, editorial callouts, financial info, calendar, operator news, KPI highlights, and promo cards.",
    urls: [
      "https://www.terna.it/en"
    ],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".area--area-1 #swiperContainer"]
      },
      {
        name: "columns-ticker",
        instances: [".area--area-1 .teleborsa--wrapper"]
      },
      {
        name: "embed-iframe",
        instances: [".area--area-3 .cmp--terna-iframe"]
      },
      {
        name: "cards-news",
        instances: [
          ".area--area-4 .cmp--terna-documentlistcover",
          ".area--area-24 .cmp--terna-documentlistcoverarchivio",
          ".area--area-27 .cmp--terna-documentlistcover"
        ]
      },
      {
        name: "cards-media",
        instances: [
          ".area--area-5 .cmp--terna-slidecontent",
          ".area--area-32 .cmp--terna-slidecontent"
        ]
      },
      {
        name: "columns-callout",
        instances: [
          ".area--area-13 .cmp--terna-slidecontent",
          ".area--area-14 .cmp--terna-slidecontent",
          ".area--area-15 .cmp--terna-slidecontent",
          ".area--area-23 .cmp--terna-slidecontent",
          ".area--area-25 .cmp--custom-html",
          ".area--area-26 .cmp--terna-slidecontent"
        ]
      },
      {
        name: "hero-dark",
        instances: [".area--area-28 .cmp--terna-slidecontent"]
      },
      {
        name: "tabs-kpi",
        instances: [".area--area-32 #kpiApp"]
      }
    ],
    sections: [
      { id: "sec-hero", name: "Hero slider + ticker", selector: ".area--area-1", style: null, blocks: ["carousel-hero", "columns-ticker"], defaultContent: [] },
      { id: "sec-realtime-demand", name: "Realtime Electricity Demand", selector: ".area--area-3", style: "light", blocks: ["embed-iframe"], defaultContent: [] },
      { id: "sec-press-releases", name: "Press Releases", selector: ".area--area-4", style: "light", blocks: ["cards-news"], defaultContent: [] },
      { id: "sec-blog-cards", name: "Blog cards", selector: ".area--area-5", style: "light", blocks: ["cards-media"], defaultContent: [] },
      { id: "sec-callout-behind-energy", name: "We are behind the energy", selector: ".area--area-9", style: "light", blocks: [], defaultContent: [".area--area-9 .cmp--website-boxevidence"] },
      { id: "sec-callout-sustainability", name: "Sustainability callout", selector: ".area--area-13", style: "light", blocks: ["columns-callout"], defaultContent: [] },
      { id: "sec-callout-innovation", name: "Innovation callout", selector: ".area--area-14", style: "light", blocks: ["columns-callout"], defaultContent: [] },
      { id: "sec-callout-electricity-system", name: "Electricity System callout", selector: ".area--area-15", style: "light", blocks: ["columns-callout"], defaultContent: [] },
      { id: "sec-callout-2025-results", name: "2025 Results callout", selector: ".area--area-23", style: "light", blocks: ["columns-callout"], defaultContent: [] },
      { id: "sec-financial-info", name: "Financial Info", selector: ".area--area-24", style: "light", blocks: ["cards-news"], defaultContent: [] },
      { id: "sec-calendar", name: "Calendar", selector: ".area--area-25", style: "light", blocks: ["columns-callout"], defaultContent: [] },
      { id: "sec-callout-regional-planning", name: "Efficient Regional Planning callout", selector: ".area--area-26", style: "light", blocks: ["columns-callout"], defaultContent: [] },
      { id: "sec-operator-news", name: "Operator News", selector: ".area--area-27", style: "light", blocks: ["cards-news"], defaultContent: [] },
      { id: "sec-callout-behind-projects", name: "Behind our projects (dark)", selector: ".area--area-28", style: "dark", blocks: ["hero-dark"], defaultContent: [] },
      { id: "sec-kpi-and-promos", name: "KPI Highlights + promo cards", selector: ".area--area-32", style: "light", blocks: ["tabs-kpi", "cards-media"], defaultContent: [] }
    ]
  };
  var parsers = {
    "carousel-hero": parse,
    "columns-ticker": parse2,
    "embed-iframe": parse3,
    "cards-news": parse4,
    "cards-media": parse5,
    "columns-callout": parse6,
    "hero-dark": parse7,
    "tabs-kpi": parse8
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
