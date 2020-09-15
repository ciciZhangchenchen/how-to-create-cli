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
