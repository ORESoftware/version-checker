'use strict';

import main from './main';
import {marker} from "./symbol";
import * as chalk from "chalk";

try{
  main();
}
catch(err){

  if(!(err && err[marker] === true)){
    throw err;
  }

  for(let [k,v] of Object.entries(err)){
    switch (k) {
      case 'message':
      case 'package':
        console.log(`${chalk.blueBright(k)}: '${v}'`);
        break;
      case 'expectedVersion':
        console.log(`${chalk.blueBright(k)}: '${chalk.bold(v)}'`);
        break;
      case 'runtimeVersion':
        console.log(`${chalk.blueBright(k)}: '${chalk.bold(v)}'`);
        break;
      default:
        console.log(`${chalk.magenta(k)}: '${v}'`);
    }
  }

  process.exit(1);
}

