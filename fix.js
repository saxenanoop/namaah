const fs = require('fs');
const files = ['data/extra/girls-b.ts'];
files.forEach(f => {
    let s = fs.readFileSync(f, 'utf8');
    s = s.replace(/theme: "rare"/g, 'theme: "modern"');
    s = s.replace(/theme: "art"/g, 'theme: "modern"');
    s = s.replace(/theme: "virute"/g, 'theme: "virtue"');
    s = s.replace(/theme: "classic"/g, 'theme: "modern"');
    fs.writeFileSync(f, s);
});
console.log('Fixed themes');
