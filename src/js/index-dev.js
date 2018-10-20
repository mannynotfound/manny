import Manny from './index';

// wrap everything inside a function scope and invoke it (IIFE, a.k.a. SEAF)
(() => new Manny({
    container: "#canvas-container"
}))();
