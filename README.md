# Manny

npm package for importing @mannynotfound into your website.

### Live Demo

[https://mannynotfound.glitch.me/](https://mannynotfound.glitch.me/)

### Usage

#### As a module

```bash
npm install manny
```

```js
import Manny from 'manny';

const manny = new Manny({
    container: '#container', // dom selector, defaults to body
});

// do specific action on loop
manny.do('bellydance');

// do all actions on loop
manny.doTheMost();
```

#### As a library

```html
<html>
    <head></head>
    <body>
        <div id="container"></div>
        <script src="https://cdn.jsdelivr.net/npm/manny/lib/manny.js" type="text/javascript"></script>
        <script>
            var manny = new Manny({ container: '#container' });
            manny.doTheMost();
        </script>
    </body>
</html>
```

### Actions

manny is using the [mixamo](https://mixamo.com) rig and will work with any animation in their library. by default, the manny
package comes with `wave`, `bellydance` and `samba`.

### Running Locally

```
npm run dev
```

Go to `localhost:8080` to see the local test application.
