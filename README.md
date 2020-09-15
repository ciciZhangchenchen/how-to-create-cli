# 从零开始写一个脚手架

## 添加package.json

```json
{
	"name": "cici-cli-test",
	"version": "0.0.1",
	"main": "index.js",
	"description": "a init cli",
	"author": "Cici Zhang",
	"license": "Apache-2.0",
	"bin": {
		"cici-cli-test": "./src/bin/cici-cli-test.js"
	},
	"dependencies": {
		"chalk": "^3.0.0",
		"commander": "^4.0.1",
		"dedent": "^0.7.0",
		"inquirer": "^7.0.1"
	}
}

```

### 需要依赖的工具

1. chalk
2. command
3. dedent	
4. inquirer

## 写一个创建组件的脚本

```js
const { prompt } = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const dedent = require('dedent');
const path = require('path');

const question = [
  {
    type: 'input',
    name: 'name',
    message: 'Please enter your package name, we will add a preset bbk- with it',
    default: 'component',
    filter(val) {
      return val.trim();
    },
    validate(val) {
      const validate = val.trim().split(' ').length === 1;
      return validate || 'Project name is not allowed to have spaces ';
    },
  },
  {
    type: 'input',
    name: 'description',
    message: 'Please enter your description',
  },
  {
    type: 'list',
    name: 'reactversion',
    message: 'Please choose version',
    default: 0,
    choices: ['16.8.0', '16.9.0',],
  },
];

const getReadMeContent = (pkgName, description) => dedent`
    # \`bbk-${pkgName}\`
    > ${description || 'TODO: description'}
    ## Usage
    \`\`\`
    ${dedent` npm i bbk-${pkgName}`}
    // TODO: DEMONSTRATE API
    \`\`\`
    ## Props
    ${dedent` | Component | description | comment |`}
    ${dedent` | props | it's a description | ... |`}
  `;

module.exports = prompt(question).then(async (resData) => {
  const {
    name, description, reactversion,
  } = resData;
  const packagesFolderName = path.resolve(process.cwd(), './packages');
  if (!fs.existsSync(packagesFolderName)) {
    fs.mkdirSync(packagesFolderName);
  }
  let folderName = path.resolve(packagesFolderName, `./bbk-${name}`);
  if (fs.existsSync(folderName)) {
    console.log(chalk.red(`Sorry, bbk-${name} is exsit`));
    return;
  }
  const packageJson = require('../TemplateCreate/package');
  const readme = getReadMeContent(name, description);
  packageJson.name = `${packageJson.name}${name}`;
  packageJson.description = description || `${packageJson.description}${name}`;
  packageJson.peerDependencies['react'] = reactversion;
  packageJson.devDependencies['react'] = reactversion;
  fs.mkdirSync(folderName);
  fs.mkdirSync(path.resolve(folderName, './src'));
  fs.writeFileSync(path.resolve(folderName, './index.jsx'), '', 'utf8');
  fs.writeFileSync(path.resolve(folderName, './index.test.js'), '', 'utf8');
  fs.writeFileSync(
    path.resolve(folderName, './package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf8',
  );
  fs.writeFileSync(path.resolve(folderName, './README.md'), readme, 'utf8');
  console.log(chalk.green('✔ Create package success'));
});

```

### 执行

<video src="./image/cici-cli-test.mov"/>

### 这个脚本是创建了一个文件夹包含一些组件的模版

<image src="./image/test-package.png"/>