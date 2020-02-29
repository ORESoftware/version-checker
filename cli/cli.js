#!/usr/bin/env node

const path = require('path');

if(process.argv.includes('--path')){
  console.log(path.resolve( __dirname + '/../dist/tool.js'));
  process.exit(0);
}

require('../dist/cli.js');
