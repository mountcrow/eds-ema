export default function decorate(block) {
  if (!block.querySelector(':scope > div:first-child picture')) {
    block.classList.add('no-image');
  }
  const content = [...block.querySelectorAll(':scope > div > div')].find((col) => !col.querySelector(':scope > picture, :scope > p > picture'));
  const first = content?.firstElementChild;
  if (first?.tagName === 'P' && first.children.length === 1
    && first.firstElementChild.matches('em, strong')
    && first.textContent.trim() === first.firstElementChild.textContent.trim()) {
    first.classList.add('hero-dark-eyebrow');
  }
}
