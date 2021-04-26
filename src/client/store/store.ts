import { Subscriber, State } from '../types';

class Store {
  private subscribers: Array<Subscriber>;

  private state: State;

  constructor(initialState: State) {
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

  updateState(callback: (currentState: State) => object): void {
    this.state = Object.assign({}, this.state, callback(this.state));

    this.subscribers.forEach((subscriber) => subscriber.update(this.state));
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
