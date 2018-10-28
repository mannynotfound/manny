import THREE from './vendor/three-shim';
import LIBRARY from './fixtures/library';
import { MANNY_URL, CLIPS_HOST } from './env';
import { createContainer, normalizeName } from './helpers';

export default class Application {
  constructor(options = {}) {
    this.do = this.do.bind(this);
    this.doTheMost = this.doTheMost.bind(this);

    if (options.container) {
      this.container = options.container;
    } else {
      const div = createContainer();
      document.body.appendChild(div);
      this.container = div;
    }
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;
    this.useBackground = options.useBackground;
  }

  init() {
    this.setupScene();
    this.setupCamera();
    this.setupLights();
    this.useBackground && this.setupFloor();
    this.loadManny();
    this.setupControls();
    this.setupRenderer();
    this.showLoader();
    this.render();
  }

  showLoader() {
    // css / html in js before it was cool
    const wrap = document.createElement('div');
    wrap.id = 'loader';
    const width = this.renderer.domElement.clientWidth;
    const height = this.renderer.domElement.clientHeight;
    wrap.style.cssText = `position: absolute; width: ${width}px; height: ${height}px;
      top: 0; left: 0; display: flex; justify-content: center; align-items: center;
      z-index: 100000; color: black; font-weight: bold; font-size: 2.250rem;
      font-family: courier, "Courier New", monospace; text-align: center;`;
    const text = document.createElement('p');
    text.id = 'loader-text';
    text.innerText = 'loading...';
    wrap.appendChild(text);
    const containerStyle = this.container.style.position;
    if (!containerStyle || containerStyle === 'static') {
      this.container.style.position = 'relative';
    }
    this.container.appendChild(wrap);

    // not supported in all browsers
    if (!text.animate) {
      return;
    }

    text.animate([
      { opacity: 1 },
      { opacity: 0.25 }
    ], {
      duration: 500,
      direction: 'alternate',
      iterations: Infinity,
    });
  }

  removeLoader() {
    const loader = document.getElementById('loader');
    loader.parentNode.removeChild(loader);
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    if (this.useBackground) {
      this.scene.background = new THREE.Color(0xf6f6f6);
      this.scene.fog = new THREE.Fog(0xf6f6f6, 500, 1000);
    }
  }

  setupRenderer() {
    const renderOptions = {
      antialias: true,
      alpha: !this.useBackground,
    };
    this.renderer = new THREE.WebGLRenderer(renderOptions);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(this.width, this.height);
    this.useBackground && this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      this.width = this.container.clientWidth || window.innerWidth;
      this.height = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(this.width, this.height);
    });
  }

  setupCamera() {
    const fov = 45;
    const aspect = this.width / this.height; const near = 1;
    const far = 2000;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(100, 200, 300);
  }

  setupLights() {
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemisphereLight.position.set(0, 200, 0);
    this.scene.add(hemisphereLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.25);
    directionalLight.position.set(0, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 180;
    directionalLight.shadow.camera.right = 120;
    directionalLight.shadow.camera.bottom = -100;
    directionalLight.shadow.camera.left = -120;
    this.scene.add(directionalLight);
  }

  setupFloor() {
    const material = new THREE.MeshPhongMaterial({ color: 0xcccccc, depthWrite: false });
    material.castShadow = false;
    material.receiveShadow = true;

    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), material);
    mesh.rotation.x = -Math.PI / 2;

    this.scene.add(mesh);

    const grid = new THREE.GridHelper(2000, 75, 0x888888, 0x888888);
    grid.material.opacity = 0.5;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  loadClip(clipName) {
    const onSuccessCallback = (object) => {
      const clipMatch = object.animations.find(clip => {
        return normalizeName(clip.name) === clipName;
      })
      if (clipMatch) {
        this.manny3D.animations.push(clipMatch);
        this.playClip(clipMatch);
      }
      this.removeLoader();
    };

    const url = `${CLIPS_HOST + clipName}.fbx`;
    this.loadModel(url, onSuccessCallback);
  }

  loadManny() {
    const onSuccessCallback = (object) => {
      this.manny3D = object;
      this.manny3D.name = 'manny';

      this.manny3D.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.scene.add(this.manny3D);
      if (!this.doCache || this.doCache === 'theMost') {
        this.doTheMost();
      } else {
        this.do(this.doCache);
      }
      this.removeLoader();
    };

    this.loadModel(MANNY_URL, onSuccessCallback);
  }

  loadModel(url, onSuccessCallback) {
    const onProgressCallback = (progress) => {
      const percentage = Math.round(100 * (progress.loaded / progress.total));
      const loaderText = document.getElementById('loader-text');
      if (loaderText) {
        loaderText.innerText = `loading... ${percentage}%`
      }
    };
    const onErrorCallback = (e) => {
      const loaderText = document.getElementById('loader-text');
      if (loaderText) {
        console.error('FBXLoader failed! ', e);
        loaderText.innerText = `failed to load \n${e}`;
      }
    };

    const loader = new THREE.FBXLoader();
    loader.load(url, onSuccessCallback, onProgressCallback, onErrorCallback);
  }

  setupControls() {
    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.enableZoom = false;
    this.controls.target.set(0, 100, 0);
    this.controls.update();
  }

  render() {
    if (this.controls) {
      this.controls.update();
    }

    if (this.manny3D && this.manny3D.mixer) {
      this.manny3D.mixer.update(this.clock.getDelta());
    }

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.render());
  }

  playNextClip(animation) {
    const clip = animation.action.getClip();
    const clipIndex = this.manny3D.animations.indexOf(clip);
    const animationsLength = this.manny3D.animations.length;
    const nextClipIndex = clipIndex + 1 === animationsLength ? 0 : clipIndex + 1;
    const nextClip = this.manny3D.animations[nextClipIndex];
    const nextAction = this.manny3D.mixer.clipAction(nextClip).reset().setLoop(THREE.LoopOnce);
    this.manny3D.mixer.stopAllAction();
    this.currentAction.crossFadeTo(nextAction, 0).play();
  }

  playClip(clip) {
    this.manny3D.mixer.removeEventListener('finished', this.playNextClip);
    const nextAction = this.manny3D.mixer.clipAction(clip).reset().setLoop(THREE.LoopRepeat);
    this.manny3D.mixer.stopAllAction();
    if (this.currentAction) {
      this.currentAction.crossFadeTo(nextAction, 0).play();
    } else {
      this.currentAction = nextAction;
      this.currentAction.play()
    }
  }

  do(clipName) {
    if (!clipName) {
      console.error('Please provide an action to perform.');
      return;
    }

    clipName = normalizeName(clipName);

    if (!this.manny3D) {
      if (clipName) {
        this.doCache = clipName;
      }
      return;
    }

    if (!this.manny3D.mixer) {
      this.manny3D.mixer = new THREE.AnimationMixer(this.manny3D);
    }

    const existingClip = this.manny3D.animations.find(clip => (
      normalizeName(clip.name) === clipName
    ));

    if (existingClip) {
      this.playClip(existingClip);
      return;
    }

    if (LIBRARY.includes(clipName)) {
      this.loadClip(clipName);
      return;
    }

    console.warn(`Couldnt find action ${clipName}, use one of ${LIBRARY.join(', ')}`);
    return;
  }

  doTheMost() {
    if (!this.manny3D) {
      this.doCache = 'theMost';
      return;
    }

    if (!this.manny3D.mixer) {
      this.manny3D.mixer = new THREE.AnimationMixer(this.manny3D);
    }

    this.manny3D.mixer.stopAllAction();
    this.currentAction = this.manny3D.mixer.clipAction(this.manny3D.animations[0]);
    this.currentAction.setLoop(THREE.LoopOnce);
    this.currentAction.play();

    this.manny3D.mixer.removeEventListener('finished', this.playNextClip);
    this.manny3D.mixer.addEventListener('finished', this.playNextClip.bind(this));
  }
}
