import { View } from '@/types';

class NotFound implements View {
  page: HTMLElement;

  constructor() {
    this.page = document.createElement('div');
    this.page.classList.add('not-found');
  }

  async render() {
    const h3 = document.createElement('h3');
    h3.appendChild(document.createTextNode('Page Not Found.'));

    this.page.appendChild(h3);

    return this.page;
  }

  afterRender() {}
}

export default NotFound;
