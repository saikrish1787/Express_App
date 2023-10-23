const express = require("express");
const User = require("../Database/Schema/user");
const router = express.Router();

async function getAllUsers(){
    try{
      const user = await User.find();
      return user;
    }catch(e){
      return e.message;
    }
}

async function findUser(name){
    let user_id;
    try{
        const user = await User.findOne({name:name})
        if(user && user._id){
            user_id = user._id
        }
        
    }catch(e){
        console.log(e)
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

router.get("/get", (req, res) => {
    getAllUsers().then(_res => res.send(_res))
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

router.delete("/:id",async (req,res) => {
    try{
        const deleted = await deleteUser(req.params.id)
        if(deleted.acknowledged){
            res.send(deleted.deleteCount + " User deleted successfully")
        }else{
            res.status(500).send("Something went wrong")
        }
    }catch(e){
        res.status(400)
        console.log(e)
    }
})

router.post("/update",async (req,res) => {
    try{
        if(req.body && req.body.id){
            const user = await User.findById(req.body.id);
            user.name = req.body.data.name || user.name;
            user.age = req.body.data.age || user.age;
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