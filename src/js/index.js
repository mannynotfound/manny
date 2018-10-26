import Application from './app';
import * as Detector from './vendor/Detector';

class Manny {
  constructor(options = {}) {
    const domSelector = options.container || 'body';
    const container = document.querySelector(domSelector);
    if (!Detector.webgl) {
      const warning = Detector.getWebGLErrorMessage();
      container.appendChild(warning);
      return null;
    }

    const useBackground = options.useBackground || false;
    const app = new Application({ container, useBackground });
    app.init();
    return app;
  }
}

export default Manny;
