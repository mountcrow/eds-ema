// Terna footer: blue band with logo + social icons, link columns, legal text, award badges.

const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.3H7.6V13h2.5v8h3.4z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M6.9 8.8H3.6V21h3.3V8.8zM5.2 3.4a1.9 1.9 0 100 3.8 1.9 1.9 0 000-3.8zM21 21h-3.3v-6c0-1.5-.5-2.5-1.8-2.5-1 0-1.6.7-1.8 1.3-.1.2-.1.5-.1.8V21H10.7s.1-11 0-12.2H14v1.7c.4-.7 1.2-1.7 3-1.7 2.2 0 3.9 1.4 3.9 4.5V21z"/></svg>',
  x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.5 3h3l-6.6 7.5L21.8 21h-6l-4.7-6.1L5.7 21h-3l7.1-8L2.4 3h6.1l4.2 5.6L17.5 3zm-1 16h1.6L7.6 4.6H5.9L16.5 19z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 4.6c2.4 0 2.7 0 3.6.1 2.5.1 3.6 1.3 3.7 3.7 0 .9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.2 3.6-3.7 3.7-.9.1-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.5-.1-3.6-1.3-3.7-3.7 0-.9-.1-1.2-.1-3.6s0-2.7.1-3.6C4.8 6 5.9 4.8 8.4 4.7c.9-.1 1.2-.1 3.6-.1zM12 3c-2.4 0-2.8 0-3.7.1C5 3.2 3.2 5 3.1 8.3 3 9.2 3 9.6 3 12s0 2.8.1 3.7c.1 3.3 1.9 5.1 5.2 5.2.9.1 1.3.1 3.7.1s2.8 0 3.7-.1c3.3-.1 5.1-1.9 5.2-5.2.1-.9.1-1.3.1-3.7s0-2.8-.1-3.7c-.1-3.3-1.9-5.1-5.2-5.2C14.8 3 14.4 3 12 3zm0 4.4a4.6 4.6 0 100 9.2 4.6 4.6 0 000-9.2zm0 7.6a3 3 0 110-6 3 3 0 010 6zm4.8-7.8a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21.6 7.2s-.2-1.4-.8-2c-.8-.8-1.6-.8-2-.9C16 4 12 4 12 4s-4 0-6.8.3c-.4 0-1.2.1-2 .9-.6.6-.8 2-.8 2S2 8.8 2 10.4v1.2c0 1.6.2 3.2.2 3.2s.2 1.4.8 2c.8.8 1.8.8 2.3.9 1.7.2 6.7.3 6.7.3s4 0 6.8-.3c.4 0 1.2-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.2v-1.2c0-1.6-.2-3.2-.2-3.2zM9.9 14.6V8.9l5.2 2.9-5.2 2.8z"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 3h-2.7v11.5a2.1 2.1 0 11-2.1-2.1c.2 0 .4 0 .6.1V9.7a5 5 0 00-.6 0 4.9 4.9 0 104.9 4.9V8.9a6 6 0 003.5 1.1V7.3a3.5 3.5 0 01-3.5-3.5 3 3 0 01-.1-.8z"/></svg>',
  slideshare: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11.3 11c0-.9-.8-1.6-1.7-1.6-1 0-1.7.7-1.7 1.6 0 .9.8 1.6 1.7 1.6 1 0 1.7-.7 1.7-1.6zm4.8 0c0-.9-.8-1.6-1.7-1.6-1 0-1.7.7-1.7 1.6 0 .9.8 1.6 1.7 1.6 1 0 1.7-.7 1.7-1.6zM20 12.3c-.4.3-1.5.9-3 .9-.9 0-1.7-.2-2.4-.6-.5.6-1.4 1-2.6 1s-2-.4-2.6-1c-.7.4-1.5.6-2.4.6-1.5 0-2.6-.6-3-.9-.3-.2-.5 0-.4.4.6 2 3 3.6 5.5 3.6.3 1.7 1.3 3.1 2.9 3.1s2.6-1.4 2.9-3.1c2.5 0 4.9-1.6 5.5-3.6.1-.4-.1-.6-.4-.4zM12 3C7.9 3 4 3.7 4 6.6v3.5c0 .4.5.5.7.3.6-.5 1.7-1 2.9-1 1.1 0 2 .4 2.6 1 .3-.3.8-.5 1.8-.5s1.5.2 1.8.5c.6-.6 1.5-1 2.6-1 1.2 0 2.3.5 2.9 1 .2.2.7.1.7-.3V6.6C20 3.7 16.1 3 12 3z"/></svg>',
};

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = block.dataset.footer;
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';

  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) {
    resp = await fetch(`${footerPath}.plain.html`);
  }
  if (!resp.ok) return;

  const html = await resp.text();
  const tmp = document.createElement('div');
  tmp.innerHTML = html;

  const sections = [...tmp.querySelectorAll('footer > div')];
  const [brandRow, statementRow, usefulRow, portalsRow, legalRow, badgesRow] = sections;

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';

  // Row 1: brand + social
  if (brandRow) {
    const row = document.createElement('div');
    row.className = 'footer-brand-row';
    const brand = document.createElement('div');
    brand.className = 'footer-brand';
    const logoLink = brandRow.querySelector('p a');
    if (logoLink) brand.append(logoLink);

    const social = document.createElement('ul');
    social.className = 'footer-social';
    brandRow.querySelectorAll('ul > li > a').forEach((a) => {
      const key = a.textContent.trim().toLowerCase();
      const li = document.createElement('li');
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener');
      a.setAttribute('aria-label', a.textContent.trim());
      a.innerHTML = SOCIAL_ICONS[key] || a.textContent;
      li.append(a);
      social.append(li);
    });
    row.append(brand, social);
    footer.append(row);
  }

  // Row 2: statement + link columns
  const linksRow = document.createElement('div');
  linksRow.className = 'footer-links-row';
  if (statementRow) {
    const col = document.createElement('div');
    col.className = 'footer-statement';
    while (statementRow.firstElementChild) col.append(statementRow.firstElementChild);
    linksRow.append(col);
  }
  [usefulRow, portalsRow].forEach((src) => {
    if (!src) return;
    const col = document.createElement('div');
    col.className = 'footer-col';
    while (src.firstElementChild) col.append(src.firstElementChild);
    linksRow.append(col);
  });
  footer.append(linksRow);

  // Row 3: legal
  if (legalRow) {
    const legal = document.createElement('div');
    legal.className = 'footer-legal';
    while (legalRow.firstElementChild) legal.append(legalRow.firstElementChild);
    footer.append(legal);
  }

  // Row 4: badges
  if (badgesRow) {
    const badges = document.createElement('div');
    badges.className = 'footer-badges';
    while (badgesRow.firstElementChild) badges.append(badgesRow.firstElementChild);
    footer.append(badges);
  }

  block.append(footer);
}
