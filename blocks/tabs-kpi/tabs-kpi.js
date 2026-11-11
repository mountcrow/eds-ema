import { toClassName } from '../../scripts/aem.js';

/**
 * Groups each KPI headline with the paragraph that follows it and splits
 * "Label<br>detail" paragraphs into a label and a smaller detail line.
 * @param {Element} panel The tab panel
 * @returns {Element|null} A trailing link-only paragraph (CTA), detached from the panel
 */
function decoratePanel(panel) {
  let cta = null;
  const last = panel.lastElementChild;
  if (last?.tagName === 'P' && last.querySelector(':scope > a:only-child')
    && last.textContent.trim() === last.querySelector('a').textContent.trim()) {
    cta = last;
    cta.remove();
  }

  const items = document.createElement('div');
  items.className = 'tabs-kpi-items';
  let current = null;
  [...panel.children].forEach((el) => {
    if (el.classList.contains('tabs-kpi-panel-title')) return;
    if (/^H[1-6]$/.test(el.tagName)) {
      current = document.createElement('div');
      current.className = 'tabs-kpi-item';
      el.classList.add('tabs-kpi-value');
      current.append(el);
      items.append(current);
    } else if (current) {
      current.append(el);
    } else if (el.tagName === 'P') {
      el.classList.add('tabs-kpi-subtitle');
    }
  });
  if (items.children.length) panel.append(items);

  items.querySelectorAll('.tabs-kpi-item > p').forEach((p) => {
    const br = p.querySelector(':scope > br');
    if (!br) return;
    const label = document.createElement('span');
    label.className = 'tabs-kpi-label';
    while (p.firstChild && p.firstChild !== br) label.append(p.firstChild);
    br.remove();
    const detail = document.createElement('small');
    while (p.firstChild) detail.append(p.firstChild);
    p.append(label, detail);
  });
  return cta;
}

export default async function decorate(block) {
  // rows without a tab label + panel (e.g. a stray block-name row) are not tabs
  [...block.children].forEach((row) => {
    if (row.children.length < 2) row.remove();
  });

  // build tablist
  const tablist = document.createElement('div');
  tablist.className = 'tabs-kpi-list';
  tablist.setAttribute('role', 'tablist');

  const box = document.createElement('div');
  box.className = 'tabs-kpi-box';
  const panels = document.createElement('div');
  panels.className = 'tabs-kpi-panels';
  let cta = null;

  // decorate tabs and tabpanels
  const rows = [...block.children];
  rows.forEach((row, i) => {
    const tab = row.firstElementChild;
    const id = toClassName(tab.textContent);

    // decorate tabpanel: the second cell holds the panel content
    const tabpanel = row.children[1];
    tabpanel.className = 'tabs-kpi-panel';
    tabpanel.id = `tabpanel-${id}`;
    tabpanel.setAttribute('aria-hidden', !!i);
    tabpanel.setAttribute('aria-labelledby', `tab-${id}`);
    tabpanel.setAttribute('role', 'tabpanel');

    const title = document.createElement('p');
    title.className = 'tabs-kpi-panel-title';
    title.textContent = tab.textContent.trim();
    tabpanel.prepend(title);
    cta = decoratePanel(tabpanel) || cta;

    // build tab button
    const button = document.createElement('button');
    button.className = 'tabs-kpi-tab';
    button.id = `tab-${id}`;
    button.textContent = tab.textContent.trim();
    button.setAttribute('aria-controls', `tabpanel-${id}`);
    button.setAttribute('aria-selected', !i);
    button.setAttribute('role', 'tab');
    button.setAttribute('type', 'button');
    button.addEventListener('click', () => {
      panels.querySelectorAll('[role=tabpanel]').forEach((panel) => {
        panel.setAttribute('aria-hidden', true);
      });
      tablist.querySelectorAll('button').forEach((btn) => {
        btn.setAttribute('aria-selected', false);
      });
      tabpanel.setAttribute('aria-hidden', false);
      button.setAttribute('aria-selected', true);
    });
    tablist.append(button);
    panels.append(tabpanel);
    row.remove();
  });

  box.append(tablist, panels);
  block.append(box);
  if (cta) {
    cta.className = 'tabs-kpi-cta';
    block.append(cta);
  }
}
