const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.mjs')) {
        results.push(file);
      }
    }
  });
  return results;
}

let files = walk('./src');
files.push('./package.json');
// Also include root js/mjs files if any
const rootFiles = fs.readdirSync('./').filter(f => f.endsWith('.js') || f.endsWith('.mjs'));
rootFiles.forEach(f => {
  if (!files.includes(f)) files.push(f);
});

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  if (file.includes('package.json')) {
    content = content.replace(/"name":\s*"pathfinder"/g, '"name": "dishant"');
  } else {
    // Replace Dishant and Dishant
    content = content.replace(/Dishant/g, 'Dishant');
    content = content.replace(/Dishant/g, 'Dishant');
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});
console.log('Renaming complete.');
