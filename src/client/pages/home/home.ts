import StoreController from '@/storeController/controller';
import { View, State } from '@/types';
import featuredSection from '@/components/featuredSection/featuredSection';
import loadError from '@/components/loadError/loadError';
import banner from '@/assets/banner.jpg';
import { setAddToCartListeners } from '@/utils/utils';

class Home implements View {
  private home: HTMLElement;
  private controller: StoreController;
  private unsubscribe: Array<() => void> = [];

  constructor(controller: StoreController) {
    this.home = document.createElement('div');
    this.home.classList.add('home-page');

    this.controller = controller;
    this.unsubscribe.push(
      this.controller.subscribeToStore(
        'GET_FEATURED_ITEMS',
        this.handleGetFeaturedSections.bind(this)
      )
    );
    this.unsubscribe.push(
      this.controller.subscribeToStore(
        'GET_FEATURED_ITEMS_ERROR',
        this.handleGetFeaturedSectionsError.bind(this)
      )
    );
  }

  async render() {
    await this.controller.getFeaturedSections({ itemsPerSection: 4 });

    return this.home;
  }

  private handleGetFeaturedSections(state: State) {
    this.home.innerHTML = '';

    //add banner
    this.home.innerHTML += `<img src="${banner}" class="home-page__banner" role="presentation"/>`;

    //add all sections found in state obj
    const sections = Object.keys(state.featuredItems);
    sections.forEach((section) => {
      this.home.innerHTML += featuredSection(
        state.featuredItems[section],
        state
      );
    });
  }

  private handleGetFeaturedSectionsError(state: State) {
    this.home.innerHTML = '';
    const error = loadError();

    this.home.appendChild(error);
  }

  afterRender() {
    setAddToCartListeners(this.home, this.controller);
  }

  unmount() {
    this.unsubscribe.forEach((unsubFunc) => unsubFunc());
  }
}

export default Home;
