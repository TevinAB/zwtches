import { CartItem, State, ProductItem } from '@/types';
import Store from '../store/store';
import Controller from './controller';
import axios, { AxiosResponse } from 'axios';

describe('Store controller tests', () => {
  jest.mock('axios');

  let store: Store;
  let state: {
    shoppingCart: Array<CartItem>;
    products: {
      items: Array<ProductItem>;
      lastPage: number;
    };
    featuredItems: {
      [key: string]: {
        title: string;
        items: Array<ProductItem>;
      };
    };
  };
  let controller: Controller;
  let callback: jest.Mock;
  const TEST_ID = 'a-123';

  beforeEach(() => {
    state = {
      shoppingCart: [],
      products: {
        items: [
          {
            name: 'Apple',
            id: TEST_ID,
            price: { raw: 12.1, formatted: 12.1 },
            media: { source: 'path/to/image' },
            permalink: 'WQaZ6z',
            description: '',
          },
          {
            name: 'Tv',
            id: 'tv-01',
            price: { raw: 300.5, formatted: 300.5 },
            media: { source: 'path/to/image' },
            permalink: 'WQaZ1z',
            description: '',
          },
        ],
        lastPage: 1,
      },
      featuredItems: {},
    };
    store = new Store(state as State);
    store.setState = jest.fn(store.setState);
    store.subscribe = jest.fn(store.subscribe);

    controller = new Controller(store);

    callback = jest.fn();
  });

  it('should allow subscriptions to the store', () => {
    controller.subscribeToStore('ADD_ITEM', callback);

    expect(store.getSubscriberCount()).toBe(1);
    expect((store.subscribe as jest.Mock).mock.calls.length).toBe(1);
    expect((store.subscribe as jest.Mock).mock.calls[0][0]).toBe('ADD_ITEM');
    expect((store.subscribe as jest.Mock).mock.calls[0][1]).toBe(callback);
  });

  it('should provide a way to unsubscribe from the store', () => {
    const cleanUp = controller.subscribeToStore('ADD_ITEM', callback);

    expect(store.getSubscriberCount()).toBe(1);
    cleanUp();
    expect(store.getSubscriberCount()).toBe(0);
  });

  it('should be able to add an item to the store', () => {
    controller.addItem({ productId: TEST_ID });
    const product = state.products.items[0];

    const expectedCartItem: CartItem = {
      name: product?.name,
      id: product?.id,
      quantity: 1,
      image: product?.media.source,
      pricePerUnit: product?.price.raw,
      permaLink: product?.permalink,
    };

    expect(store.getState().shoppingCart[0]).toEqual(expectedCartItem);
    expect(store.getState().shoppingCart.length).toBe(1);
    expect((store.setState as jest.Mock).mock.calls[0][0]).toBe('ADD_ITEM');
  });

  it('should not add duplicate items to the cart', () => {
    controller.addItem({ productId: TEST_ID });
    controller.addItem({ productId: TEST_ID });

    expect(store.getState().shoppingCart.length).toBe(1);
    expect(store.getState().shoppingCart[0].quantity).toBe(2);
  });

  it('should remove an item from the store', () => {
    controller.addItem({ productId: TEST_ID });
    expect(store.getState().shoppingCart.length).toBe(1);

    controller.removeItem({ productId: TEST_ID });
    expect(store.getState().shoppingCart.length).toBe(0);
    expect((store.setState as jest.Mock).mock.calls[1][0]).toBe('REMOVE_ITEM');

    controller.addItem({ productId: TEST_ID });
    controller.addItem({ productId: 'tv-01' });
    controller.removeItem({ productId: TEST_ID });

    expect(store.getState().shoppingCart.length).toBe(1);
    expect(store.getState().shoppingCart[0].id).toBe('tv-01');
  });

  it('should be able to change the quantity of an item already in cart', () => {
    controller.addItem({ productId: TEST_ID });
    controller.changeItemQuantity({ productId: TEST_ID, newQuantity: 4 });

    expect(store.getState().shoppingCart[0].quantity).toBe(4);
    expect((store.setState as jest.Mock).mock.calls[1][0]).toBe(
      'ITEM_QTY_CHANGE'
    );
  });

  it('should fetch products and add the results to the store', async () => {
    const mockedResObj: AxiosResponse = {
      data: {
        result: {
          items: state.products.items,
          meta: {
            lastPage: state.products.lastPage,
          },
        },
      },
      status: 200,
      statusText: 'OK',
      config: {},
      headers: {},
    };

    axios.get = jest.fn().mockResolvedValue(mockedResObj);

    //remove the products before calling get products
    store.getState().products.items = [];

    await controller.getProducts({ pageNumber: 1, category: 'men' });

    expect((axios.get as jest.Mock).mock.calls[0][0]).toBe(
      '/api/products?page=1&cat=men'
    );

    expect(store.getState().products.items.length).toBe(2);
    expect(store.getState().products.items[0].id).toBe(TEST_ID);
    expect((store.setState as jest.Mock).mock.calls.length).toBe(1);
    expect((store.setState as jest.Mock).mock.calls[0][0]).toBe('GET_PRODUCTS');
  });

  it('should fetch featured items and add the result to the store', async () => {
    const mockedResObj = {
      data: {
        men: {
          title: "Men's watches",
          items: [{ name: 'product1' }],
        },
      },
    };
    axios.get = jest.fn().mockResolvedValueOnce(mockedResObj);

    await controller.getFeaturedSections({ itemsPerSection: 3 });

    expect((axios.get as jest.Mock).mock.calls[0][0]).toBe(
      '/api/products/featured/items?ips=3'
    );

    expect(store.getState().featuredItems).toEqual(mockedResObj.data);
    expect((store.setState as jest.Mock).mock.calls[0][0]).toBe(
      'GET_FEATURED_ITEMS'
    );
  });

  it('should set the value of selectedProduct using a product found on the client side', () => {
    const testObj = state.products.items[0];

    axios.get = jest.fn().mockResolvedValueOnce({});

    controller.getSelectedProduct({ permalink: testObj.permalink });

    expect((axios.get as jest.Mock).mock.calls.length).toBe(0);
    expect(store.getState().selectedProduct).toEqual(testObj);
  });

  it('should get the selectedProduct from the server if its not found client side', () => {
    const mockedResObj = {
      perma: 'asZea',
    };

    axios.get = jest.fn().mockResolvedValueOnce(mockedResObj);

    controller.getSelectedProduct({ permalink: mockedResObj.perma });

    expect((axios.get as jest.Mock).mock.calls.length).toBe(1);
    expect(axios.get as jest.Mock).toBeCalledWith(
      `/api/products/${mockedResObj.perma}`
    );
  });
});
