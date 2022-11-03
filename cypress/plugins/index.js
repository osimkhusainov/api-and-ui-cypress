/// <reference types="cypress" />
/// <reference types="@shelex/cypress-allure-plugin" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars

const allureWriter = require("@shelex/cypress-allure-plugin/writer");
// import allureWriter from "@shelex/cypress-allure-plugin/writer";
require("dotenv").config();
// mySQL
const mysql = require("mysql");
function queryTestDb(query) {
  const db = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
  };
  // creates a new mysql connection using credentials from cypress.json env's
  const connection = mysql.createConnection({ ...db });
  // start connection to db
  connection.connect();
  // exec query + disconnect to db as a Promise
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) reject(error);
      else {
        connection.end();
        return resolve(results);
      }
    });
  });
}

module.exports = (on, config) => {
  allureWriter(on, config);
  config.env = process.env;
  on("task", {
    queryDb: (query) => {
      return queryTestDb(query);
    },
  });
  return config;
};
