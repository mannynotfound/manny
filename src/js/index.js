import Application from './app';
import * as Detector from './vendor/Detector';

export default class Manny {
  constructor(options = {}) {
    const domSelector = options.container || 'body';
    this.container = document.querySelector(domSelector);
    if (!Detector.webgl) {
      const warning = Detector.getWebGLErrorMessage();
      this.container.appendChild(warning);
      return null;
    }

    const app = new Application({ container: this.container });
    app.init();
    return app;
  }
}
