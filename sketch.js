// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

const canvasSketch = require("canvas-sketch");
const random = require('canvas-sketch-util/random');

const settings = {
  // Make the loop animated
  animate: true,
  dimensions:[1280,1280],
  fps:60,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  attributes:{antialias:true}
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color
  renderer.setClearColor('white', 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();

  const fragmentShader = `
    varying vec2 vUv;
    precision highp float;
    uniform float time;
    void main(){  
      vec3 color = 0.5 + 0.5 * cos(time + vUv.xyx + vec3(1.0, 2.0, 4.0));
      gl_FragColor = vec4(color, 1.0);
    }
  `
  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec3 pos = position.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `

  const box = new THREE.BoxGeometry(1,1,1)
  const boxMesh = new THREE.Mesh(
        box,
        new THREE.ShaderMaterial({
          uniforms: {
            time: { type: "f", value: 0 }
          },
          fragmentShader,
          vertexShader
        })
      )
      scene.add(boxMesh)

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      // Setup an isometric perspective
      const aspect = viewportWidth / viewportHeight;
      const zoom = 1.85;
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;
      camera.near = -100;
      camera.far = 100;
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update camera properties
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time }) {
      boxMesh.material.uniforms.time.value += 0.01;
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
