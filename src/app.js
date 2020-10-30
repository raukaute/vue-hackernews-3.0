import { createSSRApp } from 'vue';
import { _createRouter } from './router';
import { _createStore } from './store';
import App from './App.vue';
import { sync } from 'vuex-router-sync';

export function _createApp() {
  const app = createSSRApp(App),
    router = _createRouter(),
    store = _createStore();

  sync(store, router);

  app
    .use(router)
    .use(store)

  return { app, router, store };
}
