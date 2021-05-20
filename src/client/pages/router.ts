import { View } from '@/types';
import StoreController from '@/store/controller';
import { getRouterEventName, getViewFromUrl } from '@/utils/utils';
import NotFound from '@/pages/404/notFound';

//should persist between view changes to allow clean up before recreating new view
let selectedView: View;

async function router(
  storeController: StoreController,
  elementId: string,
  routeMap: object
) {
  if (selectedView && selectedView.unmount) selectedView.unmount();

  const path = window.location.pathname + window.location.search;
  const viewConstructor = getViewFromUrl(path, routeMap);

  const params = new URLSearchParams(window.location.search);

  selectedView = viewConstructor
    ? new viewConstructor(storeController, params)
    : new NotFound();

  const main = document.getElementById(elementId);

  if (main) {
    document.querySelector('.loading-overlay')?.classList.toggle('hidden');

    const newView = await selectedView.render();
    main.innerHTML = '';
    main.appendChild(newView);

    window.scrollTo(0, 0);

    document.querySelector('.loading-overlay')?.classList.toggle('hidden');

    selectedView.afterRender();

    linkOverride(main);
  }
}

function linkOverride(scope: HTMLElement) {
  const dataLinks = scope.querySelectorAll('[data-link]');
  dataLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      history.pushState({}, '', link.getAttribute('href'));

      window.dispatchEvent(new Event(getRouterEventName()));
    });
  });
}

export default router;
