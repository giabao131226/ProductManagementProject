const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/chat.controller");
const authen = require("../../middlewares/authentication.middlewares");
router.get("/",authen.auth,controller.chat);

module.exports = router;