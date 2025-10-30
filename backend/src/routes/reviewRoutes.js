const { getAllComments, postComment, deleteReview } = require( "../controller/reviewController")

const  express =require("express")
const userMiddleware = require("../middleware/userMiddleware")
const routes = express.Router()


routes.get("/:id",getAllComments)
routes.post("/:id",userMiddleware,postComment)
routes.delete("/:id",userMiddleware,deleteReview)

module.exports= routes