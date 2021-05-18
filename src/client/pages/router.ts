import { View } from '@/types';
import StoreController from '@/store/controller';
import { getRouterEventName, getViewFromUrl } from '@/utils/utils';

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

  //eventually add the error view in the event no match was found
  selectedView = viewConstructor && new viewConstructor(storeController);

  const main = document.getElementById(elementId);

  if (main) {
    document.querySelector('.loading-overlay')?.classList.toggle('hidden');

    const newView = await selectedView.render();
    main.innerHTML = '';
    main.appendChild(newView);

    window.scrollTo(0, 0);

    document.querySelector('.loading-overlay')?.classList.toggle('hidden');

    selectedView.afterRender();

    linkOverride();
  }
}

function linkOverride() {
  const dataLinks = document.querySelectorAll('[data-link]');
  dataLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      history.pushState({}, '', link.getAttribute('href'));

      window.dispatchEvent(new Event(getRouterEventName()));
    });
  });
}

export default router;
