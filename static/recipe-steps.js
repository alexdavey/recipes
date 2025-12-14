function getStepItems() {
  return Array.from(document.querySelectorAll('#steps li'));
}

function clearHighlight() {
  document.querySelectorAll('#steps li.highlight').forEach((el) => el.classList.remove('highlight'));
}

function setHighlight(el) {
  if (!el) return;
  clearHighlight();
  el.classList.add('highlight');
}

document.addEventListener('click', (event) => {
  const li = event.target.closest('#steps li');
  if (!li) return;

  if (li.classList.contains('highlight')) {
    li.classList.remove('highlight');
    return;
  }

  setHighlight(li);
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

  const steps = getStepItems();
  if (steps.length === 0) return;

  const current = document.querySelector('#steps li.highlight');
  let index = steps.indexOf(current);

  if (event.key === 'ArrowRight') {
    index = index < 0 ? 0 : Math.min(steps.length - 1, index + 1);
  } else {
    index = index < 0 ? steps.length - 1 : Math.max(0, index - 1);
  }

  setHighlight(steps[index]);
});

