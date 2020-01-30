import THREE from './vendor/three-shim';
import LIBRARY from './fixtures/library';
import { MANNY_URL, CLIPS_HOST } from './env';
import {
  createContainer, createLoader, normalizeName, forceElementPosition,
} from './helpers';

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
    this.setupRenderer();
    this.setupControls();
    this.showLoader();
    this.render();
  }

  showLoader() {
    const width = this.renderer.domElement.clientWidth;
    const height = this.renderer.domElement.clientHeight;
    this.loader = createLoader(width, height);
    forceElementPosition(this.container);
    this.container.appendChild(this.loader);
  }

  removeLoader() {
    if (this.loader.parentNode) {
      this.loader.parentNode.removeChild(this.loader);
    }
  }

  setupScene() {
    this.scene = new THREE.Scene();
    window.THREE = THREE;
    window.scene = this.scene;
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
    const aspect = this.width / this.height;
    const near = 1;
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
    this.hideManny();
    return new Promise((resolve, reject) => {
      const onSuccessCallback = (object) => {
        const clipMatch = object.animations.find(clip => {
          return normalizeName(clip.name) === clipName;
        })
        if (clipMatch) {
          this.manny3D.animations.push(clipMatch);
          resolve(clipMatch);
        }
        this.removeLoader();
      };

      const onProgressCallback = () => {};
      const onErrorCallback = (err) => reject(err);

      const url = `${CLIPS_HOST + clipName}.fbx`;
      const loader = new THREE.FBXLoader();
      loader.load(url, onSuccessCallback, onProgressCallback, onErrorCallback);
    });
  }

  loadManny() {
    const onSuccessCallback = (object) => {
      this.manny3D = object;
      this.manny3D.name = 'manny';
      this.manny3D.mixer = new THREE.AnimationMixer(this.manny3D);
      this.manny3D.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      this.scene.add(this.manny3D);
      this.removeLoader();
    };

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
    loader.load(MANNY_URL, onSuccessCallback, onProgressCallback, onErrorCallback);
  }

  waitForManny() {
    return new Promise(resolve => {
      const checkManny = () => {
        if (this.manny3D) {
          resolve(this.manny3D);
        } else {
          setTimeout(checkManny, 100);
        }
      };
      checkManny();
    });
  }

  setupControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableZoom = false;
    this.controls.target.set(0, 100, 0);
    this.controls.update();
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

  playClip(clip, options) {
    this.showManny();
    return new Promise(resolve => {
      this.manny3D.mixer.removeEventListener('finished');
      const nextAction = this.manny3D.mixer.clipAction(clip).reset().setLoop(THREE.LoopOnce);
      // for short pose animations, pause it on last frame
      if (clip.duration < 0.1) {
        nextAction.clampWhenFinished = true;
      }
      this.manny3D.mixer.stopAllAction();
      if (this.currentAction) {
        this.currentAction.crossFadeTo(nextAction, 0).play();
      } else {
        this.currentAction = nextAction;
        this.currentAction.play()
      }
      this.manny3D.mixer.addEventListener('finished', (event) => {
        if (options.loop) {
          this.manny3D.mixer.clipAction(clip).reset().setLoop(THREE.LoopRepeat);
        }
        resolve(event);
      });
    });
  }

  hideManny() {
    if (!this.manny3D) { return; }
    this.manny3D.traverse(child => {
      if (child.isMesh) {
        child.visible = false;
      }
    });
  }

  showManny() {
    if (!this.manny3D) { return; }
    this.manny3D.traverse(child => {
      if (child.isMesh) {
        child.visible = true;
      }
    });
  }

  do(clipName, options = {}) {
    this.hideManny();
    return new Promise(resolve => {
      clipName = normalizeName(clipName);

      if (!clipName) {
        throw 'Please provide an action to perform.';
      }

      this.waitForManny().then(() => {
        const existingClip = this.manny3D.animations.find(clip => (
          normalizeName(clip.name) === clipName
        ));

        if (existingClip) {
          this.playClip(existingClip, options).then(resolve);
        } else if (LIBRARY.includes(clipName)) {
          this.loadClip(clipName).then(clip => this.playClip(clip, options).then(resolve))
        } else {
          throw `Couldnt find action ${clipName}, use one of ${LIBRARY.join(', ')}`;
        }
      });
    });
  }

  doTheMost() {
    this.waitForManny().then(() => {
      this.manny3D.mixer.stopAllAction();
      this.currentAction = this.manny3D.mixer.clipAction(this.manny3D.animations[0]);
      this.currentAction.setLoop(THREE.LoopOnce);
      this.currentAction.play();

      this.manny3D.mixer.removeEventListener('finished', this.playNextClip);
      this.manny3D.mixer.addEventListener('finished', this.playNextClip.bind(this));
    });
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
}
