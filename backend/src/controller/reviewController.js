const Review = require("../models/reviewModel");
const Blog = require("../models/blogModel");

// ------------------ POST a Comment/Review ------------------
const postComment = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const { id } = req.params; // blog ID
    const userId = req.user?.id;


    if (!comment) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    // Optional: check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Create the review
    const newReview = await Review.create({
      comment,
      rating,
      user: userId,
      blog: id,
    });

    res.status(201).json({ success: true, review: newReview });
  } catch (e) {
    console.error("postComment error:", e);
    res.status(500).json({ message: e.message });
  }
};

// ------------------ GET All Comments for a Blog ------------------
const getAllComments = async (req, res) => {
  try {
    const { id } = req.params; // blog ID

    const reviews = await Review.find({ blog: id })
      .populate("user", "username img _id")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json({ success: true, reviews });
  } catch (e) {
  
    res.status(500).json({ message: e.message });
  }
};
const deleteReview= async(req ,res)=>{
try{
const reviewId = req.params.id
const review = await Review.findById(reviewId)
  if(!review) res.status(401).json({message:"review not found"})
    res.status(200).json({ success: true, message: "Blog deleted successfully" });

if(review.user.toString() !== req.user.id){
     return res.status(403).json({ message: "Not authorized to delete this review" });
}


  await review.deleteOne()
      res.status(200).json({ message: "Review deleted successfully",reviewId});
}catch(e){
  res.status(500).json({ message: e.message });
}
}

module.exports = {
  postComment,
  getAllComments,
deleteReview
};
