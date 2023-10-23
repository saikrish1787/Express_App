const express = require("express");
const mongoose = require("mongoose");

const userRouter = require("./src/Routes/user")

const app = express();
app.listen(3000);
app.use(express.json())
app.use("/user",userRouter)

mongoose.connect(
  "mongodb+srv://saikrishna:saikrish@cluster0.ujxcwgl.mongodb.net/",
  () => {
    console.log("Database Connected");
  },
  (e) => {
    console.log("Unable to connect to the Database "+ e);
  }
);

app.get("/", (req, res) => {
 res.send("Hello from home")
});

run();
async function run() {}
