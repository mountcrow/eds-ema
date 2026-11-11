import { createOptimizedPicture } from '../../scripts/aem.js';

/**
 * Adds dot pagination when the block holds more than one card (one card per view).
 * @param {Element} block The block element
 * @param {Element} ul The scrolling list
 */
function buildPagination(block, ul) {
  const nav = document.createElement('div');
  nav.className = 'cards-media-pagination';
  nav.setAttribute('role', 'group');
  nav.setAttribute('aria-label', 'Slides');
  const dots = [...ul.children].map((li, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'cards-media-dot';
    dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dot.addEventListener('click', () => {
      ul.scrollTo({ left: li.offsetLeft, behavior: 'smooth' });
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
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-media-card-image';
      else div.className = 'cards-media-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '1200' }]);
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);

  if (ul.children.length > 1) buildPagination(block, ul);
}
