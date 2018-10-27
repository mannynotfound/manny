# Manny

npm package for importing @mannynotfound into your website.

## Live Demo
----

[https://mannynotfound.glitch.me/](https://mannynotfound.glitch.me/)

## Usage
----

#### As a module

```bash
npm install manny
```

```js
import Manny from 'manny';

// render to the DOM
const manny = new Manny({
    container: '#container',
    useBackground: true,
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

#### Module options

| Prop | Type | Default | Description | 
| ---- |----- | ------- | ----------- |
| container | string | 'body' | dom query selector for element to append manny | 
| useBackground | boolean | false | if true, renders a white room and grid floor around manny |

## Actions
----

manny is using the [mixamo](https://mixamo.com) rig and a curated portion of their animation library with convenient aliases. 

By default, manny comes with `wave` and `idle`. Any other actions will be fetched from the action library cdn, added to the manny instance and start playing.

```js
manny.do('wave'); // loaded by default
manny.do('fly'); // fetched from cdn library + applied to manny instance
```

For a full list of available animations, [check the library fixture.](src/js/fixtures/library.json)

## Running Locally
----


```
npm run dev
```

Go to `localhost:8080` to see the local test application.
