import { _createApp } from './app';

export default async ssrContext => {
    const { app, router } = _createApp();
    const { url } = ssrContext;

    router.push(url);

    await router.isReady();

    return app;
}