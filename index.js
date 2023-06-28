require("dotenv").config(); //this is to tell that our environmental variables are there and we can use them
const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/auth");
const notesRoutes=require("./routes/notes");
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 8000;
const client = require("./configs/db");

app.use("/auth", authRoutes);
app.use("/notes",notesRoutes);
app.get("/health",(req,res)=>{
  return res.status(200).send("Server is healthy.");
  //this is to check health of server
})
//connecting database
client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
  }
});
//starting of server
app.listen(port, () => {
  console.log("Server has started to run");
});
