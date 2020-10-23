import { _createApp } from './app';

export default async ssrContext => {
    const { app, router } = _createApp();
    const { url } = ssrContext;

    router.push(url);

    await router.isReady();
    // console.log(router.currentRoute.value.matched[0].path);
    // ssrContext._chunks = router.currentRoute.value.matched[0].path;
    return app;
}