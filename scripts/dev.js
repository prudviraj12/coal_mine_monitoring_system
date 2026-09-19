const { spawn } = require('node:child_process');
const net = require('node:net');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const children = [];
let stopping = false;

function startService(name, directory) {
  const child = spawn(npmCommand, ['run', 'dev'], {
    cwd: path.join(root, directory),
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env }
  });

  children.push(child);
  child.on('error', error => {
    console.error(`[${name}] failed to start:`, error.message);
    stopAll(1);
  });
  child.on('exit', code => {
    if (!stopping) {
      console.error(`[${name}] stopped unexpectedly with exit code ${code}.`);
      stopAll(code || 1);
    }
  });
}

function stopAll(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exitCode = exitCode;
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));

function isListening(port) {
  return new Promise(resolve => {
    const socket = net.createConnection({ host: 'localhost', port });
    socket.setTimeout(500);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => resolve(false));
  });
}

async function main() {
  console.log('Starting CoalTrack backend and frontend...');

  if (await isListening(5000)) {
    console.log('Backend is already running on http://localhost:5000');
  } else {
    startService('backend', 'backend');
  }

  if (await isListening(3000)) {
    console.log('Frontend is already running on http://localhost:3000');
  } else {
    startService('frontend', 'frontend');
  }
}

main().catch(error => {
  console.error('Unable to start CoalTrack:', error);
  stopAll(1);
});
