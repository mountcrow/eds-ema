// Terna header: transparent bar with hamburger + logo (left), search + locale (right).
// The hamburger opens a full-screen flyout with main nav links + utility links.

function closeMenu(block) {
  block.classList.remove('menu-open');
  const toggle = block.querySelector('.nav-hamburger');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('nav-open');
}

function openMenu(block) {
  block.classList.add('menu-open');
  const toggle = block.querySelector('.nav-hamburger');
  if (toggle) toggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('nav-open');
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = block.dataset.nav;
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/content/nav';

  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${navPath}.plain.html`);
  }
  if (!resp.ok) return;

  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  const sections = [...tmp.querySelectorAll('header > div')];
  const [brandSection, mainSection, utilitySection, localeSection] = sections;

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Main navigation');

  // --- top bar ---
  const bar = document.createElement('div');
  bar.className = 'nav-bar';

  const hamburger = document.createElement('button');
  hamburger.className = 'nav-hamburger';
  hamburger.setAttribute('type', 'button');
  hamburger.setAttribute('aria-label', 'Menu');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.innerHTML = '<span class="nav-hamburger-icon"></span>';
  hamburger.addEventListener('click', () => {
    if (block.classList.contains('menu-open')) closeMenu(block);
    else openMenu(block);
  });

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  if (brandSection) {
    const link = brandSection.querySelector('a');
    if (link) brand.append(link);
  }

  const barLeft = document.createElement('div');
  barLeft.className = 'nav-bar-left';
  barLeft.append(hamburger, brand);

  const tools = document.createElement('div');
  tools.className = 'nav-tools';

  const search = document.createElement('button');
  search.className = 'nav-search';
  search.setAttribute('type', 'button');
  search.setAttribute('aria-label', 'Search');
  tools.append(search);

  if (localeSection) {
    const locale = document.createElement('div');
    locale.className = 'nav-locale';
    const localeLinks = localeSection.querySelectorAll('a');
    localeLinks.forEach((a, i) => {
      if (i > 0) locale.append(document.createTextNode('|'));
      locale.append(a);
    });
    tools.append(locale);
  }

  bar.append(barLeft, tools);

  // --- flyout panel ---
  const panel = document.createElement('div');
  panel.className = 'nav-panel';

  if (mainSection) {
    const main = document.createElement('div');
    main.className = 'nav-main';
    const ul = mainSection.querySelector('ul');
    if (ul) main.append(ul);
    panel.append(main);
  }
  if (utilitySection) {
    const util = document.createElement('div');
    util.className = 'nav-utility';
    const ul = utilitySection.querySelector('ul');
    if (ul) util.append(ul);
    panel.append(util);
  }

  nav.append(bar, panel);
  block.append(nav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu(block);
  });

  const mq = window.matchMedia('(min-width: 900px)');
  mq.addEventListener('change', () => closeMenu(block));
}
