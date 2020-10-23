const interopDefault = (promise) => promise.then((m) => m.default || m);

const { feeds } = require('@/common/api');

const {
  createRouter,
  createMemoryHistory,
  createWebHistory,
} = require('vue-router');

const isServer = typeof window === 'undefined';

let history = isServer ? createMemoryHistory() : createWebHistory();

const routes = [
  {
    path: '/',
    redirect: '/news'
  },
  {
    path: '/:feed/:page(\\d+)?',
    name: 'feed-page',
    component: () =>
      interopDefault(
        // Make sure to set webpackChunkName to route.path to enable preloading css-chunks
        import(/* webpackChunkName: "feeds" */ '@/pages/FeedList.vue')
      ),
    props: route => (
      {
        feed: route.params.feed,
        page: Number(route.params.page) || 1,
        maxPage: feeds[route.params.feed]['pages']
      }
    ),
  },
];

export function _createRouter() {
  return createRouter({ routes, history });
}
