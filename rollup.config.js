import babel from "@rollup/plugin-babel";
import pluginNodeResolve from "@rollup/plugin-node-resolve";

// These are our dependencies, everything else is in the bundle
const external = [
  "@react-three/fiber",
  "@react-three/drei",
  "react",
  "react/jsx-runtime",
  "three",
];
const extensions = [".js", ".jsx", ".json"];

const getBabelOptions = ({ useESModules }, targets) => ({
  babelHelpers: "runtime",
  babelrc: false,
  extensions,
  include: ["src/**/*", "**/node_modules/**"],
  plugins: [["@babel/transform-runtime", { regenerator: false, useESModules }]],
  presets: [
    ["@babel/preset-env", { loose: true, modules: false, targets }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
});

export default [
  {
    external,
    input: `./src/index.js`,
    output: { dir: "lib", format: "es" },
    plugins: [
      pluginNodeResolve({ extensions }),
      babel(
        getBabelOptions(
          { useESModules: true },
          ">1%, not dead, not ie 11, not op_mini all"
        )
      ),
    ],
  },
];
