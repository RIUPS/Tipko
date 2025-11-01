const { exec } = require('child_process');
const path = require('path');

const runBackup = () => {
  return new Promise((resolve, reject) => {
    // Try to run mongodump if available; otherwise fallback to a message
    const outDir = path.resolve(__dirname, '..', 'backups');
    const cmd = `mongodump --uri="${process.env.MONGO_URI}" --out="${outDir}"`;

    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        return reject('mongodump not available or failed: ' + (stderr || err.message));
      }
      resolve({ stdout: stdout.trim(), outDir });
    });
  });
};

module.exports = {
  runBackup
};
