import { Subscriber } from '../types';

class Store {
  private subscribers: Array<Subscriber>;

  private state: {};

  constructor(initialState: {}) {
    this.subscribers = [];
    this.state = initialState;
  }

  subscribe(subscriber: Subscriber): () => void {
    this.subscribers.push(subscriber);

    //returns a function that can be used by the subscriber to unsubscribe from the store
    return () => {
      this.subscribers = this.subscribers.filter((subs) => subs !== subscriber);
    };
  }

  updateState(callback: (currentState: object) => object): void {
    this.state = Object.assign({}, this.state, callback(this.state));

    this.subscribers.forEach((subscriber) => subscriber.update(this.state));
  }

  getState() {
    return this.state;
  }
}

export default Store;
