'use strict';

import * as chalk from "chalk";

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

import * as fs from 'fs'
import {marker} from "./symbol";
import * as residence from 'residence';
import * as util from 'util';
import * as path from 'path';
import * as semver from 'semver';
import log from './logging';
import * as find from './find';

const join = (...args: any[]): string => {
  return args.map(v => typeof v === 'string' ? v : util.inspect(v)).join(' ')
};

export default () => {

  const pkgJsonFilePath = path.resolve(process.cwd() + '/package.json');

  try {
    fs.statSync(pkgJsonFilePath)
  }
  catch (err) {
    if (!/no such file or directory/.test(err.message)) {
      console.error(err);
    }
    process.exit(1);
  }

  const pkgJson = require(pkgJsonFilePath);

  const createMapper = (v: {[key:string]: string}) => (z: string) => ({package: z, version: v[z]});

  const deps = Object.keys(pkgJson.dependencies || {}).map(createMapper(pkgJson.dependencies || {}))
    .concat(Object.keys(pkgJson.devDependencies || {}).map(createMapper(pkgJson.devDependencies || {})))
    .concat(Object.keys(pkgJson.optionalDependencies || {}).map(createMapper(pkgJson.devDependencies || {})));

  for (const d of deps) {

    let folderContainingPackageJson = null;
    try {
      // var resolved = require.resolve(d.package);
       folderContainingPackageJson = find.findPackageJSON(process.cwd(), `/node_modules/${d.package}/package.json`);
      // console.log({folderContainingPackageJson, pkg: d.package});
    }
    catch (err) {

      if(!folderContainingPackageJson){
        throw {
          message: `The following package could not be resolved '${d.package}'`,
          package: d.package,
          [marker]: true
          // join(`The version for package '${pkgJson.name}' did not match expected version:`, chalk.gpkgJson.version, d.version);
        }
      }
      if (!d.package.startsWith('@types/')) {
        log.warn(`Could not require.resolve package: '${d.package}'`);
      }
      continue;
    }

    if (!folderContainingPackageJson) {
      throw new Error(join('Could not locate package.json in or about path:', folderContainingPackageJson));
    }

    const pkgJson = require(folderContainingPackageJson);

    if (pkgJson.name != d.package) {
      log.warn('name does not match:', pkgJson.name, 'versus:', d.package);
      continue;
    }

    if (!pkgJson.version) {
      log.warn('package.json has no version field:', pkgJson);
      continue;
    }

    try {
      var b = semver.satisfies(pkgJson.version, d.version);
      log.debug(pkgJson.name, 'satisfied?:', b);
    }
    catch (e) {
      throw new Error(join('semver.satisfies could not be called for package here:', pkgJson));
    }

    if (b !== true) {

      // console.log({resolved, folderContainingPackageJson, pkgJson});

      throw {
        message: `The version for package '${pkgJson.name}' did not match expected version`,
        package: pkgJson.name,
        expectedVersion: pkgJson.version,
        runtimeVersion: d.version,
        [marker]: true
        // join(`The version for package '${pkgJson.name}' did not match expected version:`, chalk.gpkgJson.version, d.version);
      }
    }

  }

};

