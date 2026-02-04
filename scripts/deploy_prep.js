const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'out');
const targetDir = path.join(__dirname, '..', 'CARPETA_SUBIDA_FEROZO');

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName),
                path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

console.log(`Copying files from ${sourceDir} to ${targetDir}...`);

if (!fs.existsSync(sourceDir)) {
    console.error('Source directory "out" does not exist. Did the build fail?');
    process.exit(1);
}

// Ensure target directory exists (it should, but just in case)
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

copyRecursiveSync(sourceDir, targetDir);
console.log('Copy complete!');
