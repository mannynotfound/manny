# Manny

npm package for importing @mannynotfound into your website. manny will be represented as a 3D model loaded with [three.js](https://threejs.org/) and appended to an element in the DOM.

## Live Demo

[https://mannynotfound.github.io/](https://mannynotfound.github.io/)

## Usage

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

// do specific action once
manny.do('bellydance');

// do specific action on loop
manny.do('agony', { loop: true });

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

manny is using the [mixamo](https://www.mixamo.com) rig and a curated portion of their animation library with convenient aliases. By default, manny comes with `wave` and `idle`. Any other actions will be fetched from the action library cdn, added to the manny instance and start playing.

Actions are called with the `do` function:

```js
manny.do('wave'); // loaded by default
manny.do('fly'); // fetched from cdn library + applied to manny instance
```

#### do options

| Prop | Type | Default | Description | 
| ---- |----- | ------- | ----------- |
| loop | boolean | false | if true, will loop action until new action is chosen | 

```js
manny.do('bellydance', { loop: true });
```

For a full list of available animations, [check the library fixture.](src/js/fixtures/library.json)

## Events

manny's `do` function returns a promise that can be used to listen to the completion of an action. The promise
will resolve with an "event" containing the type, action, target and direction. For example:

```js
manny.do('victory').then(event => {
  console.log(event.type); // "finished"
  console.log(event.action); // three.js AnimationAction instance
  console.log(event.target); // three.js AnimationMixer instance
  console.log(event.direction); // 1

  showVictoryText('Good job!');
});
```

_note: this can be used with `{ loop: true }` but will only fire the first time the action is completed_

## Running Locally

```bash
npm run dev
```

Go to `localhost:8080` to see the local test application.
