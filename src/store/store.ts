export type Reducer<S, T> = (state: S, payload: T) => S;
export type Slicer<S, T> = (state: S) => T;
export type Subscriber<S> = (state: S) => void;
export interface Dispatcher<P> {
  /**
   * Dispatches a new action for the reducer to update state in the store.
   *
   * Optionally passes a payload for the reducer's second parameter.
   */
  dispatch: (payload?: P) => void;
}
export interface Registration<S, K extends keyof S, T extends S[K]> {
  /**
   * Data to initiate state slice with.
   */
  initialSliceData?: T;
  /**
   * Function to execute when values are dispatched.
   *
   * Receives current sliced state as the first parameter
   * and the dispatched value as second.
   */
  reducer: Reducer<T, T>;
  /**
   * Key (property) of state to reduce.
   */
  key: K;
  /**
   * Unique type of action that will be dispatched.
   *
   * Note: will throw if type has been registered before.
   */
  type: string;
}
export interface Store<S> {
  /**
   * Registers a new reducer for a specified key of the state.
   * @param registration Object that contains the registration details.
   */
  register: <K extends keyof S, P extends S[K]>(
    registration: Registration<S, K, P>
  ) => Dispatcher<P>;
  /**
   * Subscribe to `Store` changes.
   *
   * Subscriber function will execute on every change.
   */
  subscribe: (subscriber: Subscriber<S>) => Subscription;
}
export interface StoreOptions {
  enableLog: boolean;
}
export interface Subscription {
  /**
   * Stops receiving change notifications from the `Store`.
   */
  unsubscribe: () => void;
}

/**
 * Creates a new `Store` for state that can be subscribed for changes
 * and updated immutably by registering reducers
 * and calling their respective dispatch functions.
 * @param initialData Data to initialize the store with.
 * @param options Optionally enable logs.
 */
export function createStore<S extends {}>(
  initialData: S,
  options: StoreOptions = { enableLog: false }
): Store<S> {
  let store: S = Object.freeze({ ...initialData });
  const reducers = new Map<string, Registration<S, keyof S, any>>();
  const subscribers = new Set<Subscriber<S>>();
  const log = options.enableLog ? logger : () => null;

  log(null, '[Core] initialize store', null, store);

  return {
    register,
    subscribe,
  };

  function register<K extends keyof S, P extends S[K]>(
    registration: Registration<S, K, P>
  ): Dispatcher<P> {
    const { initialSliceData, reducer, key, type } = registration;

    if (reducers.has(type)) {
      throw new Error(`Store already has registration of type (${type}).
Choose a different name or only call register() once per type.`);
    }

    reducers.set(type, {
      key,
      reducer,
      type,
    });
    reduce(initialSliceData);

    return { dispatch };

    function dispatch(payload?: P) {
      const lastState = store;
      store = Object.freeze({ ...store, [key]: reduce(payload) });
      subscribers.forEach(subscriber => subscriber(store));

      log(lastState, type, payload, store);
    }

    function reduce(payload?: P) {
      return reducers.has(type)
        ? reducers.get(type)!.reducer(store[key], payload)
        : store;
    }
  }

  function subscribe(subscription: Subscriber<S>): Subscription {
    subscribers.add(subscription);
    subscription(store);

    return {
      unsubscribe: () => subscribers.delete(subscription),
    };
  }
}

function logger<S, T>(lastState: S, type: string, payload: T, state: S) {
  // tslint:disable: no-console
  console.group('Store');
  console.log(`Previous state`, lastState);
  console.log(`Action`, payload ? { type, payload } : { type });
  console.log(`Next state`, state);
  console.groupEnd();
  // tslint:enable: no-console
}
