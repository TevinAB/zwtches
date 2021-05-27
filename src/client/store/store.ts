import { State, EventTypes } from '@/types';
import { storeCart } from '@/utils/utils';

class Store {
  private subscribers: Array<{
    callBack: (state: State) => void;
    eventType: EventTypes;
  }>;

  private state: State;

  constructor(initialState: State) {
    this.subscribers = [];
    this.state = initialState;
  }

  subscribe(
    eventType: EventTypes,
    callBack: (state: State) => void
  ): () => void {
    this.subscribers.push({ callBack, eventType });

    //returns an unsubscribe function
    return () => {
      this.subscribers = this.subscribers.filter(
        (sub) => sub.callBack !== callBack
      );
    };
  }

  setState(eventType: EventTypes, newState: State): void {
    this.state = { ...newState };

    //saves to local storage
    storeCart(this.state.shoppingCart);

    this.notify(eventType);
  }

  private notify(eventType: EventTypes) {
    this.subscribers.forEach((sub) => {
      if (sub.eventType === eventType) sub.callBack(this.state);
    });
  }

  getState(): State {
    return this.state;
  }

  //used in tests
  getSubscriberCount(): number {
    return this.subscribers.length;
  }
}

export default Store;
