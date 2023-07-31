const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campground");
const catchasync = require("../utils/catchasync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
  .route("/")
  .get(catchasync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
    catchasync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, campgrounds.renderNewCampground);

router
  .route("/:id")
  .get(catchasync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    upload.array("image"),
    catchasync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchasync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchasync(campgrounds.editCampground)
);

module.exports = router;
