import { _createApp } from "./app";

const { app, router } = _createApp();

router.isReady().then(() => app.mount("#app", true))
