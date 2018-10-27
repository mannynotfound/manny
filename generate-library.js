const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, 'assets/clips'), (err, items) => {
  const clips = items.filter(item => item.endsWith('.fbx'));
  const clipNames = clips.map(clip => clip.replace('.fbx', ''));
  const json = JSON.stringify(clipNames, null, 2);
  const output = path.join(__dirname, 'src/js/fixtures/library.json');
  fs.writeFile(output, json, 'utf-8', () => console.log('Generated library!'));
});
