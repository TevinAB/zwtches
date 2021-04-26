import { Subscriber, State } from './../types';
import Store from './store';

class TestObj implements Subscriber {
  update = jest.fn();
}

describe('Tests for the Store object', () => {
  let subscriber: TestObj;
  let store: Store;
  let state: State;
  const TEST_ID = 'apl12';

  beforeEach(() => {
    subscriber = new TestObj();
    store = new Store(state);
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
  });

  it('should accept subscribers', () => {
    expect(store).not.toBe(null);
    expect(store.getSubscriberCount()).toBe(0);

    store.subscribe(subscriber);
    expect(store.getSubscriberCount()).toBe(1);
  });

  it('should allow subscribers to unsubscribe', () => {
    const cleanUp = store.subscribe(subscriber);
    expect(store.getSubscriberCount()).toBe(1);
    cleanUp();
    expect(store.getSubscriberCount()).toBe(0);
  });

  it('should allow state updates', () => {
    store.updateState((state: State) => {
      return {
        shoppingCart: state.shoppingCart.map((cartItem) => {
          if (cartItem.id !== TEST_ID) return cartItem;

          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }),
      };
    });

    expect(store.getState().shoppingCart[0].quantity).toBe(2);
    expect(store.getState().shoppingCart[0].pricePerUnit).toBe(12.1);
    expect(store.getState().shoppingCart[1].quantity).toBe(1);
  });

  it('should update all subscribers when there is a change in state', () => {
    store.subscribe(subscriber);

    store.updateState((state: State) => {
      return {
        shoppingCart: state.shoppingCart.map((cartItem) => {
          if (cartItem.id !== TEST_ID) return cartItem;

          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }),
      };
    });

    expect(subscriber.update.mock.calls.length).toBe(1);
  });

  it('should allow its state to be read', () => {
    expect(store.getState()).toEqual(state);
  });
});
