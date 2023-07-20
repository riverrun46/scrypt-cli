const fs = require('fs-extra');
const path = require('path');
const json5 = require('json5');
const { exit } = require('process');
const { green, red } = require('chalk');
const { stepCmd, readdirRecursive, isProjectRoot, readConfig, writefile, readfile } = require('./helpers');
const { compileContract } = require('scryptlib');


async function compile() {

  if (!isProjectRoot()) {
    console.error(red(`Please run this command in the root directory of the project.`))
    exit(-1)
  }

  const tsconfigPath = "tsconfig-scryptTS.json";

  const result = await stepCmd(`Git check if '${tsconfigPath}' exists`, `git ls-files ${tsconfigPath}`);
  if (result === tsconfigPath) {
    await stepCmd(`Git remove '${tsconfigPath}' file`, `git rm -f ${tsconfigPath}`)
    await stepCmd("Git commit", `git commit -am "remove ${tsconfigPath} file."`)
  } 

  // Check TS config
  let outDir = "artifacts";

  const config = JSON.parse(readConfig('tsconfig.json'));
  config.compilerOptions.plugins.push({
    transform: require.resolve("scrypt-ts-transpiler"),
    transformProgram: true,
    outDir
  })

  writefile(tsconfigPath, JSON.stringify(config, null, 2));


  const ts_patch_path = require.resolve("ts-patch").replace("index.js", "");

  const tspc = ts_patch_path + "bin" + path.sep + "tspc.js";

  // Run tsc which in turn also transpiles to sCrypt
  await stepCmd(
    'Building TS',
    `node ${tspc} --p ${tsconfigPath}`
  );

  fs.removeSync(tsconfigPath)

  // Recursively iterate over dist/ dir and find all classes extending 
  // SmartContract class. For each found class, all it's compile() function.
  // This will generate the artifact file of the contract.
  // TODO: This is a hacky approach but works for now. Is there a more elegant solution?


  var currentPath = process.cwd();
  if (!fs.existsSync(outDir)) {
    console.log(red(`ERROR: outDir '${outDir}' not exists`));
    exit(-1);
  }

  const distFiles = await readdirRecursive(outDir);


  for (const f of distFiles) {
    fAbs = path.resolve(f);
    if (path.extname(fAbs) == '.scrypt') {
      try {
        const outDir = path.join(currentPath, path.dirname(f));
        const result = compileContract(f, {
          out: outDir,
          artifact: true
        });

        if (result.errors.length > 0) {
          const resStr = `\nCompilation failed.\n`;
          console.log(red(resStr));
          console.log(red(`ERROR: Failed to compile ${f}`));
          exit(-1);
        }

        const artifactPath = path.join(outDir, `${path.basename(f, '.scrypt')}.json`);

        console.log(green(`Compiled successfully, artifact file: ${artifactPath}`));
      } catch (e) {
        const resStr = `\nCompilation failed.\n`;
        console.log(red(resStr));
        console.log(red(`ERROR: ${e.message}`));
        exit(-1);
      }
    }
  };

  const resStr = `\nProject was successfully compiled!\n`;
  console.log(green(resStr));
  exit(0);
}


module.exports = {
  compile,
};