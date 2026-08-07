const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/chat.controller");
const authen = require("../../middlewares/authentication.middlewares");

router.get("/:roomChatID",controller.chat);

module.exports = router;