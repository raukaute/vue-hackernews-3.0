import { _createApp } from './app';

export default async ssrContext => {
    const { app, router, store } = _createApp();
    const { url } = ssrContext;

    router.push(url);

    await router.isReady();

    ssrContext.state = store.state
    return app;
}