const { Client } = require("@elastic/elasticsearch");

const { elasticSearchHost } = require("../utils/hosts");

const client = new Client({
  node: `http://${elasticSearchHost}:9200`,
  // auth: {
  //   username: "Shahab",
  //   password: "12345678",
  // },
  headers: {
    'Content-Type': 'application/json'
  }
});

// console.log("elastic module");

module.exports = client;
