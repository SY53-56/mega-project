const Review = require("../models/reviewModel");
const Blog = require("../models/blogModel");

// ------------------ POST COMMENT ------------------
const postComment = async (req, res) => {
  try {
    const { comment } = req.body;
    const { id } = req.params; // blogId
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Login required" });
    }

    if (!comment) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const review = await Review.create({
      comment,
      user: userId,
      blog: id,
    });

    res.status(201).json({ success: true, review });
  } catch (e) {
    console.error("postComment error:", e);
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ GET COMMENTS ------------------
const getAllComments = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await Review.find({ blog: id })
      .populate("user", "username image")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ DELETE REVIEW ------------------
const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Login required" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      reviewId,
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

// ------------------ LIKE / UNLIKE ------------------
const commentLikes = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { reviewId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Login required" });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const isLiked = review.likes.includes(userId);

    if (isLiked) {
      await Review.findByIdAndUpdate(reviewId, {
        $pull: { likes: userId },
      });
    } else {
      await Review.findByIdAndUpdate(reviewId, {
        $addToSet: { likes: userId },
      });
    }

    res.status(200).json({
      success: true,
      liked: !isLiked,
    });
  } catch (e) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  postComment,
  getAllComments,
  deleteReview,
  commentLikes,
};
