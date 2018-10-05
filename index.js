'use strict';

const debug = require('debug')('mk:raspberry-restart:index');
const axios = require('axios');
const Monitor = require('ping-monitor');

let alreadyFailedOnce = false;
let restartingPi = false;
let config;

try {
  config = require('./config.json');
} catch(err) {
  console.error('NO_CONFIG_FOUND');
  process.exit(1);
}

debug(`Starting monitor for ${config.host}`);
const piMonitor = new Monitor({
  website: config.host,
  interval: config.intervalInMinutes,
});

piMonitor.on('down', handlePiDown);
piMonitor.on('error', handlePiDown);

function handlePiDown(response) {
  if (restartingPi) {
    return;
  }

  debug('Pi is down', alreadyFailedOnce);

  if (alreadyFailedOnce) {
    restartPi();

    alreadyFailedOnce = false;
    return;
  }

  alreadyFailedOnce = true;
}

function restartPi() {
  debug('Turning off Pi');
  restartingPi = true;

  axios({
    method: config.offMethod,
    url: config.offURL,
  });

  setTimeout(() => {
    debug ('Turning on Pi');

    axios({
      method: config.onMethod,
      url: config.onURL,
    });
  }, config.waitAfterOff);

  setTimeout(() => {
    debug('Finished waiting.. Raspberry should be back up!');
    restartingPi = false;
  }, config.waitAfterReboot);
}