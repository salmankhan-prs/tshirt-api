const express = require("express");
const fs = require("fs");
const { dirname } = require("path");
const { isLoggedIn, customRole } = require("../middlewares/user");
const router = express.Router();

router.get("/logs", isLoggedIn, customRole("admin"), (req, res) => {
  fs.readFile(
    `logs/${new Date().toLocaleDateString("en-ca")}.log`,
    (err, fileBuffer) => {
      console.log(err);
      let logger = new Buffer.from(fileBuffer).toString();
      // arra
      logger = logger.substr(0, logger.length - 3);
      console.log(logger);
      arrayLogger = "[" + logger + "]";
      const logsJson = JSON.parse(arrayLogger);
      console.log(logsJson);
      res.status(200).send(logsJson);
    }
  );
  console.log(req.ips);
});
module.exports = router;
