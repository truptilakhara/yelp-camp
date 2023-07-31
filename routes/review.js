const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/review");
const catchasync = require("../utils/catchasync");

router.post("/", isLoggedIn, validateReview, catchasync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchasync(reviews.deleteReview)
);

module.exports = router;
