'use strict';

import fs from 'fs';
const tasks = fs.readdirSync('./_tasks/');

tasks.forEach(task => {
  if (task.slice(-3) !== '.js') {
    return;
  }
  require('./_tasks/' + task);
});