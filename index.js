'use strict';

const debug = require('debug')('mk:raspberry-restart:index');
const axios = require('axios');
const Monitor = require('ping-monitor');

let alreadyFailedOnce = false;
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

  axios.get(config.offURL);

  setTimeout(() => {
    debug ('Turning on Pi');

    axios.get(config.onURL);
  }, config.waitAfterOff);
}