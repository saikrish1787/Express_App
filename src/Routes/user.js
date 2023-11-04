const express = require("express");
const User = require("../Database/Schema/user");
const user = require("../Database/Schema/user");
const router = express.Router();

async function getAllUsers(){
    try{
      const user = await User.find();
      return user;
    }catch(e){
      return e.message;
    }
}

async function deleteUser(userId){
    try{
       const result = await User.deleteOne({_id:userId   + ""})
       return result;
    }catch(e){
        console.log(e)
        return e;
    }
}
  
async function createUser(data){
    try{
      const user = await User.create({
        name:data.name,
        age:data.age,
        email:data.email
      })
      const obj ={
        id:user._id,
        message:"User created successfully"
      }
      return obj;
    }catch(e){
      console.log(e.message)
    }
}

  //User Routes goes here

router.get("/get",async (req, res) => {
    const body = req.body;
    if(body && body.id){
      const user = await User.findById(body.id)
      console.log(user)
      res.send(user)
    }else{
      getAllUsers().then(_res => res.send(_res))
    }
  });

router.post("/create",(req,res) => {
    try{
      const body = req.body;
      if(body.name && typeof body.age === "number"){
        createUser(body).then(_res => res.send(_res))
      }else{
        res.send("Something went wrong")
      }
    }catch(e){
        console.log(e)
    }
})

router.delete("/delete",async (req,res) => {
  if(req.body && req.body.id){
    try{
        const deleted = await deleteUser(req.body.id)
        console.log(deleted)
        if(deleted.acknowledged){
            res.send(deleted.deletedCount + " User deleted successfully")
        }else{
            res.status(500).send("Something went wrong")
        }
    }catch(e){
        res.status(400).send(e.message)
        console.log(e)
    }
  }else{
    res.status(500).send("Something went wrong")
  }
})

router.post("/update",async (req,res) => {
    try{
        if(req.body && req.body.id){
            const user = await User.findById(req.body.id);
            user.name = req.body.data.name || user.name;
            user.age = req.body.data.age || user.age;
            user.email = req.body.data.email || user.email;
            await user.save()
            res.send("Updated sucessfully")
        }else{
            res.status(404).send("UserId is missing")
        }
    }catch(e){
        console.log(e)
    }
})

module.exports = router;