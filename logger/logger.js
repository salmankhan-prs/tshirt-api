const fs = require("fs/promises");
const winston = require("winston");

const { combine, timestamp, label, printf, json } = winston.format;

format = winston.format;
const logger = (level, message, ip = "No Ip") => {
  let data = {
    timeStamps: new Date(),
    level,
    message,
    ip,
  };
  const fileName = `logs/${new Date().toLocaleDateString("en-Ca")}.log`;

  let res = JSON.stringify(data);
  fs.appendFile(fileName, res + "," + "\r\n")
    .then((res) => console.log(res))
    .catch((e) => console.log(e));
};

module.exports = logger;

// winstonLogger = winston.createLogger({
//   transports: [
//     new winston.transports.File({
//       filename: `logs/${new Date().toLocaleDateString("en-ca")}.json`,
//       level: level,
//     }),
//   ],
// });
// winstonLogger.log({ level, message });
// } else {
