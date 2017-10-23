// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

exports.icon = name => fs.readFileSync(`./public/img/avatar.png`);

// Some details about the site
exports.siteName = 'CEUFLIX';
