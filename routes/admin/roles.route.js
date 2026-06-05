const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/roles.controller")
const authorization = require("../../middlewares/authorization.middleware")

router.get("/",authorization.autho("permissions-role-view"),controller.index);
router.get("/create",authorization.autho("permissions-role-create"),controller.create);
router.post("/create",authorization.autho("permissions-role-create"),controller.createRole);
router.delete("/delete/:id",authorization.autho("permissions-role-delete"),controller.deleteRole);
router.get("/edit/:id",authorization.autho("permissions-role-edit"),controller.edit);
router.patch("/edit/:id",authorization.autho("permissions-role-edit"),controller.editPatch);
router.get("/permissions",controller.permissions);
router.patch("/permissions",controller.permissionsPatch);

module.exports = router;