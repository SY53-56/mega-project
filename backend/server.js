require("dotenv").config()

const app = require("./src/app")
const connectDB = require("./src/db/connect")

const port = process.env.PORT || 5000


const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL)

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`)
    })
  } catch (e) {
    console.log("server is failed now", e.message)
  }
}

startServer()
