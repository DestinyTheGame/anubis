import pkgjson from '../package.json';
import git from 'git-rev-sync';

//
// Include various of information that might be needed to draft a new
// build.
//
const release = {
  version: pkgjson.version,
  branch: git.branch(),
  sha: git.short()
};
