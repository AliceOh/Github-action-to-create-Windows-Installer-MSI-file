const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const fs = require('fs');
const path = require('path');

function setPath() {
  const wixPath = process.env['WIX'] + '\\bin';
  console.log(`adding ${wixPath} to Path`);
  process.env['Path'] = wixPath + ';' + process.env['Path'];
}

async function go_msi(version, exefile) {
  const options = {};
  options.listeners = {
    stdout: logData,
    stderr: logData,
  };

  const cwd = process.cwd();

  // go-msi was struggling with its default temp dir; it wanted something relative to the source dir
  // for some reason.
  console.log('making build path');
  const buildPath = path.join(cwd, 'build');
  fs.mkdirSync(buildPath);

  // go-msi expects things laid out in a certain way; just putting them there is easier than
  // configuring go-msi
  console.log('making bin path');
  const binPath = path.join(cwd, 'bin');
  fs.mkdirSync(binPath);
  console.log('moving exe to bin/exe');
  fs.renameSync(path.join(cwd, exefile), path.join(binPath, exefile));

  try {
    await exec.exec(
      '"C:\\Program Files\\go-msi\\go-msi.exe"',
      ['make',
       '--msi', exefile+'.msi',
       '--out', buildPath,     // default build loc fails
       '--version', version],  // required
      options);
  } catch(e) {
    core.setFailed(e.message);
  }
}

function logData(data) {
  console.log(data.toString());
}

try {
  const version = core.getInput('version');
  const exefile = core.getInput('exefile');

  console.log(`Building MSI for version ${version} exe file ${exefile}`);

  setPath();

  go_msi(version, exefile);
} catch (error) {
  core.setFailed(error.message);
}