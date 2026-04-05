const fs = require('fs');
const path = require('path');

const directoryPath = 'd:\\abduAllah folder\\mykam\\MDS-PROJECT\\control-pannel-master (1)\\control-pannel-master\\src';

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    // Replace incorrectly joined localhost URLs
    // matches: http://localhost:3000followedByALetter
    // ignoring instances where it's already correct like http://localhost:3000/
    content = content.replace(/http:\/\/localhost:3000([a-zA-Z])/g, 'http://localhost:3000/$1');
    
    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
            replaceInFile(fullPath);
        }
    }
}

console.log("Starting script to fix URLs...");
processDirectory(directoryPath);
console.log("Done.");
