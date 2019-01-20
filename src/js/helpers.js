export const normalizeName = (name) => (
  name && name.replace('Armature|', '').toLowerCase()
);

export const createContainer = () => {
  const div = document.createElement('div');
  div.setAttribute('id', 'canvas-container');
  div.setAttribute('class', 'container');
  return div;
};

export const createLoader = (width, height) => {
  const wrap = document.createElement('div');
  wrap.id = 'loader';
  wrap.style.cssText = `position: absolute; width: ${width}px; height: ${height}px;
    top: 0; left: 0; display: flex; justify-content: center; align-items: center;
    z-index: 100000; color: black; font-weight: bold; font-size: 1.2rem;
    font-family: courier, "Courier New", monospace; text-align: center;`;
  const text = document.createElement('p');
  text.id = 'loader-text';
  text.innerText = 'loading...';
  wrap.appendChild(text)

  // not supported in all browsers
  if (!text.animate) {
    return wrap;
  }

  text.animate([
    { opacity: 1 },
    { opacity: 0.25 }
  ], {
    duration: 500,
    direction: 'alternate',
    iterations: Infinity,
  });

  return wrap;
};

export const forceElementPosition = (element) => {
  const positionStyle = element.style.position;
  if (!positionStyle || positionStyle === 'static') {
    element.style.position = 'relative';
  }
  return element;
};
