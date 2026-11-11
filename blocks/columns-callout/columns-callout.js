export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-callout-${cols.length}-cols`);

  // setup image columns, drop empty columns, flag eyebrow labels
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      if (!col.textContent.trim() && !col.querySelector('picture, img, iframe')) {
        col.remove();
        return;
      }
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          // picture is only content in column
          picWrapper.classList.add('columns-callout-img-col');
        }
      }
      const first = col.firstElementChild;
      if (first?.tagName === 'P' && first.children.length === 1
        && first.firstElementChild.matches('em, strong')
        && first.textContent.trim() === first.firstElementChild.textContent.trim()) {
        first.classList.add('columns-callout-eyebrow');
      }
    });
  });
}
