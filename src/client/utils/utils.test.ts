import { getViewFromUrl } from './utils';

describe('getViewFromUrl util function test', () => {
  const routerMap = {
    '/cart$': 'cart view constructor function',
    '/catalog[?]page=[0-9]+$': 'catalog view constructor function',
    '/$': 'home page constructor function',
  };

  it('should return text matching the home page route', () => {
    window.history.pushState({}, '', '/');
    const path = window.location.pathname + window.location.search;
    const matchingText = getViewFromUrl(path, routerMap);

    expect(matchingText).toBe(routerMap['/$']);
  });

  it('should return undefined', () => {
    window.history.pushState({}, '', '/wrong');
    const path = window.location.pathname + window.location.search;
    const matchingText = getViewFromUrl(path, routerMap);

    expect(matchingText).toBeUndefined();
  });

  it('should return text matching the catalog route', () => {
    window.history.pushState({}, '', '/catalog?page=12');
    const path = window.location.pathname + window.location.search;
    const matchingText = getViewFromUrl(path, routerMap);

    expect(matchingText).toBe(routerMap['/catalog[?]page=[0-9]+$']);
  });

  it('should return undefined if passed an empty route object', () => {
    window.history.pushState({}, '', '/catalog?page=12');
    const path = window.location.pathname + window.location.search;
    const matchingText = getViewFromUrl(path, {});

    expect(matchingText).toBeUndefined();
  });
});
