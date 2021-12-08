const express = require("express");
const router = express.Router();
//import home controller
const { home, homeDummy } = require("../controllers/homeController");

router.get("/", home);
router.get("/dummy", homeDummy);

module.exports = router;
