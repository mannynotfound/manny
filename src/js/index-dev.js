import Manny from './index';

// wrap everything inside a function scope and invoke it (IIFE, a.k.a. SEAF)
(() => {
  const manny = new Manny({
    container: "#canvas-container",
    useBackground: false,
  });
  window.manny = manny;

  manny.do('wave', { loop: true }).then(event => {
    console.log('Action completed!', event);
  });
})();
