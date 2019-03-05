import { CaseSetup } from './case-setup';
import { createSlice } from './createSlice';
import { Store } from './store';
import { Subscription } from './subscription';
import { MetaReducer, Reducer, Subscriber } from './types';

/**
 * Creates a new `Store` for state that can be subscribed for changes
 * and updated immutably by registering reducers
 * and calling their respective dispatch functions.
 * @param initialData Data to initialize the store with.
 * @param metaReducers Optionally provide meta reducers,
 * which run on every dispatch but have no effect on state.
 * `logger()` available.
 * @example
 * createStore({ count: 0, name: '' }, logger())
 */
export function createStore<S extends {}>(
  initialData: S,
  ...metaReducers: Array<MetaReducer<S, any>>
): Store<S> {
  let store: S;
  const reducers = new Set<string>();
  const subscribers = new Set<Subscriber<S>>();

  set({ ...initialData }, '[Core] initialize store');

  return {
    case: caseType,
    slice: (property: keyof S) =>
      createSlice({
        getState: () => store,
        property: property as any,
        register,
        setProp,
        subscribe,
      }),
    subscribe,
  };

  function caseType(type: string): CaseSetup<S> {
    return {
      reduce: <P>(reducer: Reducer<S, P>) => {
        register(type);

        return (payload?: P) => set(reducer(store, payload), type, payload);
      },
    };
  }

  function register(type: string) {
    if (reducers.has(type)) {
      throw new Error(`Store already has registration of type (${type}).
Choose a different type and make sure you only call register() once per type.`);
    }

    reducers.add(type);
  }

  function set<P>(state: S, type: string, payload?: P) {
    store = Object.freeze(state);
    metaReducers.forEach(meta => meta(store, { type, payload }));
    subscribers.forEach(subscriber => subscriber(store));
  }

  function setProp<K extends keyof S, P>(
    prop: K,
    propState: S[K],
    type: string,
    payload?: P
  ) {
    set({ ...store, [prop]: Object.freeze(propState) }, type, payload);
  }

  function subscribe(subscriber: Subscriber<S>): Subscription {
    subscribers.add(subscriber);
    subscriber(store);

    return {
      unsubscribe: () => subscribers.delete(subscriber),
    };
  }
}
