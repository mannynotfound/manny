import THREE from './vendor/three-shim';

export default class Application {
  constructor(opts = {}) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mixers = [];

    if (opts.container) {
      console.log('SETTING CONTAINER ', opts.container);
      this.container = opts.container;
    } else {
      const div = Application.createContainer();
      document.body.appendChild(div);
      this.container = div;
    }

    this.init();
  }

  init() {
    this.setupScene();
    this.setupCamera();
    this.setupLights();
    this.setupFloor();
    this.setupModel();
    this.setupControls();
    this.setupRenderer();
    this.render();
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf6f6f6);
    this.fog = new THREE.Fog(0xf6f6f6, 500, 1000);
    this.scene.fog = this.fog;
    this.clock = new THREE.Clock();
  }

  render() {
    this.controls && this.controls.update();
    this.mixers.forEach(mixer => mixer.update(this.clock.getDelta()));
    this.renderer.render(this.scene, this.camera);
    // when render is invoked via requestAnimationFrame(this.render) there is
    // no 'this', so either we bind it explicitly or use an es6 arrow function.
    // requestAnimationFrame(this.render.bind(this));
    requestAnimationFrame(() => this.render());
  }

  static createContainer() {
    const div = document.createElement('div');
    div.setAttribute('id', 'canvas-container');
    div.setAttribute('class', 'container');
    return div;
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(this.width, this.height);
    //this.renderer.shadowMap.enabled = true;
    //this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    //this.renderer.shadowMap.needsUpdate = true;

    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
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

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
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

    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry( 2000, 2000 ), material);
    mesh.rotation.x = -Math.PI / 2;

    this.scene.add(mesh);


    const grid = new THREE.GridHelper(2000, 75, 0x888888, 0x888888);
    grid.material.opacity = 0.5;
    grid.material.transparent = true;
    this.scene.add(grid);
  }

  setupModel() {
    const manager = new THREE.LoadingManager();
    manager.onError = function(url) {
      console.log('Some error at ', url);
    };

    const onSuccessCallback = (object) => {
      object.mixer = new THREE.AnimationMixer(object);
      object.name = 'manny';
      this.mixers.push(object.mixer);
      const action = object.mixer.clipAction(object.animations[0]);
      action.play();
      object.traverse(child => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      console.log('Loaded Asset:', object);
      this.scene.add(object);
    }

    const onProgressCallback = () => {};
    const onErrorCallback = (e) => {
        console.error("JSONLoader failed! because of error ", e);
    };

    const loader = new THREE.FBXLoader(manager);
    loader.load('assets/models/Manny.fbx', onSuccessCallback, onProgressCallback, onErrorCallback);
  }

  setupControls() {
    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.target.set(0, 100, 0);
    this.controls.update();
  }
}
