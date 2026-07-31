const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/users.controller");

router.get("/not-friends",controller.notFriend);
router.get("/request-friends",controller.requestFriends);
router.get("/requests",controller.acceptFriends);
router.get("/friends",controller.friends);

module.exports = router;