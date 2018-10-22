# Manny

npm package for importing @mannynotfound into your website.

### Live Demo

[https://mannynotfound.glitch.me/](https://mannynotfound.glitch.me/)

### Usage

```bash
npm install manny
```

```js
import Manny from 'manny';

const manny = new Manny({
    container: '#container', // dom selector, defaults to body
});

// play all animations on loop
manny.play();

// play specific animation on loop
manny.play('bellydance');
```

### Running Locally

```
npm run dev
```

Go to `localhost:8080` to see the local test application.
