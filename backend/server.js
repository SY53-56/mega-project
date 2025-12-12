require("dotenv").config();
const app= require("./src/app")
const connectDB = require("./src/db/connect")


console.log("Mongo URL:", process.env.MONGO_URL);
const port =process.env.PORT
const startServer =async ()=>{
    try{
      await connectDB(process.env.MONGODB_URL)
        app.listen(port, () => {
      console.log(`🚀 Server running on port sahul ${port}`);
    });
    }catch(e){
  console.log("server is faild now",e.message)
    }
}
startServer()