import { getRouterEventName } from '@/utils/utils';

export default function error(
  message: string = 'Oops, an error has occurred!'
) {
  const container = document.createElement('div');
  container.classList.add('load-error');

  const errorMsg = document.createElement('h3');
  errorMsg.appendChild(document.createTextNode(message));

  const reloadBtn = document.createElement('button');
  reloadBtn.classList.add('btn-reload');
  reloadBtn.innerHTML = '<i class="fas fa-redo"></i> Reload';
  reloadBtn.addEventListener('click', () => {
    window.dispatchEvent(new Event(getRouterEventName()));
  });

  container.appendChild(errorMsg);
  container.appendChild(reloadBtn);
  return container;
}
