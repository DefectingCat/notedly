export interface Store {
  isLoggedIn: boolean;
}

const store: Store = {
  isLoggedIn: !!window.localStorage.getItem('token'),
};

export default store;
