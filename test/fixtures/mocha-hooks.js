"use strict";

const fs = require("fs");
const rimraf = require("rimraf");

/**
 * Clean the .tmp directory before each test
 */
beforeEach("clean the .tmp directory", async () => {
  // Delete the .tmp directory, if it exists
  await new Promise(r => rimraf("test/.tmp", r));

  // Re-create the .tmp directory
  await new Promise((resolve, reject) => {
    fs.mkdir("test/.tmp", (err) => err ? reject(err) : resolve());
  });
});
