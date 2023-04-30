import dts from 'rollup-plugin-dts';
import esbuild from 'rollup-plugin-esbuild';

const name = 'manny';

// These are our dependencies, everything else is in the bundle
const external = [
  '@react-three/fiber',
  '@react-three/drei',
  'react',
  'react/jsx-runtime',
  'three',
];

const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
  external,
});

export default [
  bundle({
    plugins: [esbuild()],
    output: {
      file: `dist/${name}.js`,
      format: 'es',
    },
  }),
  bundle({
    plugins: [dts()],
    output: {
      file: `dist/${name}.d.ts`,
      format: 'es',
    },
  }),
];
