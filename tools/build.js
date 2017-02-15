'use strict';

const pkgjson = require('../package.json');
const rev = require('git-rev-sync');
const git = require('git-shizzle');
const path = require('path');
const fs = require('fs');

//
// Create a custom authors parser.
//
git.parse('authors', {
  params: '--pretty=format:"%aN" --no-merges',
  cmd: 'log'
}, function parse(output, format, formatter) {
  return output.split(/\n/).map(function map(line) {
    var meta = formatter(line, format);

    return meta.authored.name_map;
  })
  .filter(Boolean)
  .filter(function one(what, index, arr) {
    return !~what.indexOf('[bot]') && arr.indexOf(what) === index;
  });
});

//
// List of our amazing beta, pre 1.0 testers <3. Sorted alphabetically
// because of OCD.
//
const beta = [
  'Ainger25uk',
  'ApexCris',
  'Jay-V',
  'Lyncher1'
];

//
// Include various of information that might be needed to draft a new
// build.
//
const release = {
  authors: git().parse.authors(),
  version: pkgjson.version,
  branch: rev.branch(),
  sha: rev.short(),
  beta: beta
};

fs.writeFileSync(path.join(__dirname, '..', 'manifest.json'), JSON.stringify(release, null, 2));
