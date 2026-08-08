const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/chat.controller");
const authen = require("../../middlewares/authentication.middlewares");
const chatMiddleware = require("../../middlewares/client/chat.middleware");

router.get("/:roomChatID",chatMiddleware.check,controller.chat);

module.exports = router;