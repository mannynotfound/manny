const Application = require('./app').default;
const Detector = require('./vendor/Detector');

class Manny {
  constructor(options = {}) {
    const domSelector = options.container || 'body';
    this.container = document.querySelector(domSelector);
    this.render();
  }
  render() {
    if (!Detector.webgl) {
      const warning = Detector.getWebGLErrorMessage();
      this.container.appendChild(warning);
      return;
    }

    const app = new Application({ container: this.container });
    console.log('manny scene initiated:', app);
  }
}

module.exports = Manny;
