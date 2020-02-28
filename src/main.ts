'use strict';

import * as chalk from "chalk";

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

import {marker} from "./symbol";
import * as residence from 'residence';
import * as util from 'util';
import * as path from 'path';
import * as semver from 'semver';

const join = (...args: any[]): string => {
  return args.map(v => typeof v === 'string' ? v : util.inspect(v)).join(' ')
};

export default () => {

  const pkgJson = require(path.resolve(process.cwd() + '/package.json'));

  const createMapper = (v: any) => (z: string) => ({package: z, version: v[z]});

  const deps = Object.keys(pkgJson.dependencies || {}).map(createMapper(pkgJson.dependencies || {}))
    .concat(Object.keys(pkgJson.devDependencies || {}).map(createMapper(pkgJson.devDependencies || {})))
    .concat(Object.keys(pkgJson.optionalDependencies || {}).map(createMapper(pkgJson.devDependencies || {})));

  for (const d of deps) {

    try {
      var resolved = require.resolve(d.package);
    } catch (err) {
      if(!d.package.startsWith('@types/')){
        console.warn(`Could not require.resolve package: '${d.package}'`);
      }
      continue;
    }

    const folderContainingPackageJson = residence.findRootDir(
      path.dirname(resolved),
      'package.json'
    );

    if(!folderContainingPackageJson){
      throw new Error(join('Could not locate package.json in or about path:', folderContainingPackageJson));
    }

    const pkgJson = require(folderContainingPackageJson + '/package.json');

    if (pkgJson.name != d.package) {
      console.warn('name does not match:', pkgJson.name, 'versus:', d.package);
      continue;
    }

    if (!pkgJson.version) {
      console.log('package.json has no version field:', pkgJson);
      continue;
    }

    try {
      var b = semver.satisfies(pkgJson.version, d.version);
      console.log(pkgJson.name, 'satisfied?:', b);
    } catch (e) {
      throw new Error(join('semver.satisfies could not be called for package here:', pkgJson));
    }

    if (b !== true) {
      throw {
        message: `The version for package '${pkgJson.name}' did not match expected version`,
        package: pkgJson.name,
        expectedVersion: pkgJson.version,
        runtimeVersion: d.version,
        [marker]: true
        // join(`The version for package '${pkgJson.name}' did not match expected version:`, chalk.gpkgJson.version, d.version);
      }
    }

    // console.log({
    //   lastIndex,
    //   firstIndex,
    //   z,
    //   d,
    //   resolved,
    //   folderContainingPackageJson
    // });

  }


};

