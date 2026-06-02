const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/auth.controller");

router.get("/",controller.index);
router.post("/",controller.signIn);

module.exports = router;