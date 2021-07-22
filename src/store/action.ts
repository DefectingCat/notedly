import { Store } from './state';

export interface Action {
  type: 'login' | 'logout';
}

const reducer = (store: Store, action: Action): Store => {
  switch (action.type) {
    case 'login':
      store.isLoggedIn = true;
      return store;
    case 'logout':
      store.isLoggedIn = false;
      return store;
    default:
      throw new Error('test');
  }
};

export default reducer;
