import { _createApp } from './app';

const { app, router, store } = _createApp();

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

(async (r, a) => {
  await r.isReady();
  a.mount('#app', true);
})(router, app);
