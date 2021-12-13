const fs = require("fs/promises");
const winston = require("winston");

const { combine, timestamp, label, printf, json } = winston.format;

format = winston.format;
const logger = (level = info, message) => {
  if (level === "error") {
    winstonLogger = winston.createLogger({
      format: combine(timestamp(), format.json()),
      transports: [
        new winston.transports.File({
          filename: `logs/${new Date().toLocaleDateString("en-ca")}-error.log`,
          level: "error",
        }),
      ],
    });
    winstonLogger.log({ level, message });
  } else {
    let data = {
      timeStamps: new Date(),
      level,
      message,
    };
    const fileName = `logs/${new Date().toLocaleDateString("en-Ca")}.log`;

    let res = JSON.stringify(data);
    fs.appendFile(fileName, res + "\r\n")
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  }
};

module.exports = logger;
