import { CartItem, State } from '@/types';
import Store from './store';

describe('Tests for the Store object', () => {
  let store: Store;
  let state: { shoppingCart: Array<CartItem> };
  const TEST_ID = 'apl12';
  let callBack: jest.Mock<any, any>;

  beforeEach(() => {
    state = {
      shoppingCart: [
        {
          name: 'Apple',
          quantity: 1,
          id: TEST_ID,
          pricePerUnit: 12.1,
          image: 'path/to/image',
        },
        {
          name: 'Tv',
          quantity: 1,
          id: 'tv-01',
          pricePerUnit: 300.5,
          image: 'path/to/image',
        },
      ],
    };
    store = new Store(state as State);
    callBack = jest.fn();
  });

  it('should accept subscribers', () => {
    expect(store).not.toBe(null);
    expect(store.getSubscriberCount()).toBe(0);

    store.subscribe('ADD_ITEM', callBack);
    expect(store.getSubscriberCount()).toBe(1);
  });

  it('should allow subscribers to unsubscribe', () => {
    const cleanUp = store.subscribe('ADD_ITEM', callBack);

    expect(store.getSubscriberCount()).toBe(1);
    cleanUp();
    expect(store.getSubscriberCount()).toBe(0);
  });

  it('should allow state updates', () => {
    const newState = { ...state };
    newState.shoppingCart[0].quantity = 2;

    store.setState('ITEM_QTY_CHANGE', newState as State);

    expect(store.getState().shoppingCart[0].quantity).toBe(2);
    expect(store.getState().shoppingCart[0].pricePerUnit).toBe(12.1);
    expect(store.getState().shoppingCart[1].quantity).toBe(1);
  });

  it('should update all subscribers when there is a change in state', () => {
    const callBack2 = jest.fn();
    store.subscribe('ITEM_QTY_CHANGE', callBack);
    store.subscribe('ADD_ITEM', callBack2);

    const newState = { ...state };
    newState.shoppingCart[0].quantity = 2;

    store.setState('ITEM_QTY_CHANGE', newState as State);

    expect(callBack.mock.calls.length).toBe(1);
    expect(callBack.mock.calls[0][0]).toEqual(newState);
    expect(callBack2.mock.calls.length).toBe(0);
  });

  it('should allow its state to be read', () => {
    expect(store.getState()).toEqual(state);
  });
});
