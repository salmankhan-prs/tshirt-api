const BigPromises = require("../middlewares/bigPromise");

//dummy controller for home
exports.home = BigPromises((req, res) => {
  res.status(200).send({
    sucess: true,
    gretting: "Hello from API ....",
  });
});
exports.homeDummy = (req, res) => {
  res.status(200).send({
    sucess: true,
    gretting: "Hello from dummy route  ....",
  });
};
