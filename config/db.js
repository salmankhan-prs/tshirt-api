const mongoose = require("mongoose");
const logger = require("../logger/logger");

const connectWithDb = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("DB CONNECTED "), logger("info", `DATABASE CONNECTED `);
    })
    .catch((e) => {
      console.log("DB CONNECTION ISSUES");
      console.log(e);
      process.exit(1);
    });
};

module.exports = connectWithDb;
