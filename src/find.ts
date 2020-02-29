'use strict';

import * as path from 'path';
import * as fs from 'fs';


export const r2gSmokeTest = () => {
  return true;
};

export const findPackageJSON = (pth: string, f: string): string | null => {

  let possiblePkgDotJsonPath = path.resolve(pth + '/' + f);

  try {
    if (fs.statSync(possiblePkgDotJsonPath).isFile()) {
      return possiblePkgDotJsonPath;
    }
  }
  catch (err) {
    // ignore
  }

  let subPath = path.resolve(pth + '/../');

  if (subPath === pth) {
    return null;
  }

  return findPackageJSON(subPath, f);

};

