'use strict';

export const r2gSmokeTest = function () {
  // r2g command line app uses this exported function
  return true;
};

import * as util from 'util';
import * as path from 'path';
import * as semver from 'semver';

const join = (...args: any[]) : string => {
  return args.map(v => typeof v === 'string' ? v : util.inspect(v)).join(' ')
};

export default () => {

  const pkgJson = require(path.resolve(process.cwd() + '/package.json'));

  const createMapper = (v: any) => (z: string) => ({package: z, version:v[z]});

  const deps = Object.keys(pkgJson.dependencies || {}).map(createMapper(pkgJson.dependencies || {}))
    .concat(Object.keys(pkgJson.devDependencies || {}).map(createMapper(pkgJson.devDependencies || {})))
    .concat(Object.keys(pkgJson.optionalDependencies || {}).map(createMapper(pkgJson.devDependencies || {})));


  for(const d of deps){

    const version = d.version;

    try{
      var resolved = require.resolve(d.package);
    }
    catch(err){
      // console.warn(err);
      continue;
    }


    const token  ='/node_modules/';
    const lastIndex = resolved.lastIndexOf(token);
    const i = lastIndex + token.length;
    const firstIndex = resolved.slice(i);
    const z = firstIndex.indexOf('/');
    const folderContainingPackageJson = resolved.slice(0, lastIndex + token.length + z);

    const pkgJson = require(folderContainingPackageJson + '/package.json');

    if(pkgJson.name != d.package){
      console.warn('name does not match:', pkgJson.name, 'versus:', d.package);
      continue;
    }

    if(!pkgJson.version){
      console.log('package.json has no version field:', pkgJson);
      continue;
    }

    try{
      var b = semver.satisfies(pkgJson.version, d.version);
      console.log(pkgJson.name, 'satified?:', b);
    }
    catch (e) {
      throw new Error(join('semver.satisfies could not be called for package here:', pkgJson ));
    }

    if(b !== true){
      throw new Error(join(`The version for package '${pkgJson.name}' did not match expected version:`, pkgJson.version, d.version));
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

