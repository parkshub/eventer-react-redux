const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const repo = process.argv[2];
const parser = require(path.join(repo, 'tests/node_modules/@babel/parser'));
const trackedAndUntracked = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], {
  cwd: repo,
  encoding: 'utf8'
}).trim().split('\n');
const files = [...new Set(trackedAndUntracked)]
  .filter(file => /\.(js|jsx|cjs)$/.test(file) && fs.existsSync(path.join(repo, file)));
const failures = [];
for (const file of files) {
  try {
    parser.parse(fs.readFileSync(path.join(repo, file), 'utf8'), {
      sourceType: 'unambiguous',
      plugins: ['jsx']
    });
  } catch (error) {
    failures.push({ file, line: error.loc?.line, column: error.loc?.column, message: error.message });
  }
}
console.log(JSON.stringify({ files: files.length, failures }, null, 2));
process.exitCode = failures.length ? 1 : 0;
