const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/user.controller");

router.get("/",controller.index);
router.patch("/change-status/:status/:id",controller.changeStatus);
router.patch("/ban/:id",controller.ban);
router.delete('/delete/:id',controller.delete);

module.exports = router;