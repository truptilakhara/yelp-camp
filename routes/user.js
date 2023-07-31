const express = require("express");
const passport = require("passport");
const { storeReturnTo } = require("../middleware");
const router = express.Router({ mergeParams: true });
const catchasync = require("../utils/catchasync");
const users = require("../controllers/user");

router.route("/register").get(users.renderRegister).post(users.register);

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      faliureRedirect: "/login",
    }),
    users.loginUser
  );

router.get("/logout", users.logoutUser);

module.exports = router;
