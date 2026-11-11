import { createOptimizedPicture } from '../../scripts/aem.js';

const ITEMS_PER_PAGE = 3;

/**
 * Adds dot pagination for the horizontally scrolling pages of the list.
 * @param {Element} block The block element
 * @param {Element} ul The scrolling list
 * @param {number} pages Number of pages
 */
function buildPagination(block, ul, pages) {
  const nav = document.createElement('div');
  nav.className = 'cards-news-pagination';
  nav.setAttribute('role', 'group');
  nav.setAttribute('aria-label', 'Pages');
  const dots = [...Array(pages).keys()].map((page) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'cards-news-dot';
    dot.setAttribute('aria-label', `Go to page ${page + 1}`);
    dot.addEventListener('click', () => {
      ul.scrollTo({ left: page * ul.clientWidth, behavior: 'smooth' });
    });
    nav.append(dot);
    return dot;
  });

  const update = () => {
    const active = Math.round(ul.scrollLeft / Math.max(ul.clientWidth, 1));
    dots.forEach((dot, i) => dot.setAttribute('aria-current', i === active));
  };
  ul.addEventListener('scroll', update, { passive: true });
  update();
  block.append(nav);
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-news-card-image';
      else div.className = 'cards-news-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);

  const pages = Math.ceil(ul.children.length / ITEMS_PER_PAGE);
  if (pages > 1) buildPagination(block, ul, pages);
}
