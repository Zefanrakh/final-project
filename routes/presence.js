const router = require("express").Router();
const Controller = require("../controllers/presence");
const { adminAuthorization } = require("../middlewares/authorization");

router.use(adminAuthorization);

router.get("/", Controller.getPresence);
router.post("/", Controller.postPresence);

module.exports = router;
