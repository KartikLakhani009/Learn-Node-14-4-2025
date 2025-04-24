#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const appName = process.argv[2] || 'my-express-app';
const appPath = path.join(process.cwd(), appName);

console.log(`\n🚧 Creating project: ${appName}\n`);

// 1. Create project folder
fs.mkdirSync(appPath);

// 2. Navigate and initialize
process.chdir(appPath);
execSync('npm init -y', { stdio: 'inherit' });

// 3. Install dependencies
console.log('\n📦 Installing dependencies...');
execSync('npm install express', { stdio: 'inherit' });
execSync('npm install -D typescript ts-node-dev @types/node @types/express', { stdio: 'inherit' });

// 4. Create tsconfig.json
const tsconfig = {
    "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "rootDir": "src",
        "outDir": "dist",
        "esModuleInterop": true,
        "strict": true
    }
};
fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));

// 5. Create src/ structure and boilerplate
fs.mkdirSync('src');
fs.writeFileSync('src/server.ts', `
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (_, res) => {
  res.send('Hello from Express + TypeScript!');
});

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});
`.trim());

// 6. Add dev scripts
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts = {
    ...pkg.scripts,
    dev: 'ts-node-dev --respawn --transpile-only src/server.ts',
    build: 'tsc',
    start: 'node dist/server.js'
};
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));

console.log('\n✅ Setup complete!');
console.log(`\n👉 Next steps:
  cd ${appName}
  npm run dev`);
