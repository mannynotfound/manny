export const normalizeName = (name) => name.replace('Armature|', '').toLowerCase();

export const createContainer = () => {
  const div = document.createElement('div');
  div.setAttribute('id', 'canvas-container');
  div.setAttribute('class', 'container');
  return div;
};
