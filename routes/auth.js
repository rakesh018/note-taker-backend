const express=require("express");
const { signUp, signIn,} = require("../controllers/auth");
const router=express.Router();

router.post("/signup",signUp); //localhost:8000/auth/signup
router.post("/signin",signIn); //localhost:8000/auth/signin
module.exports=router;