const router = require("express").Router();
const mediaRoutes = require("./routes");

router.use("/", mediaRoutes);

module.exports = router;
