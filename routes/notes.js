const express=require("express");
const { addNote, updateNote, getAllNotes, deleteNote, getNote } = require("../controllers/notes");
const { verifyToken } = require("../middlewares/authMiddleware");
const { handleNoteIdParam } = require("../middlewares/noteMiddleware");
const router=express.Router();

router.param("noteId",handleNoteIdParam);
//we can run a middleware for every time we have parameter noteId in our request
//middleware can possibly also add noteId as a member to req object 

//for adding,deleting,updating and getting all notes it is important the user is verified
//for verifying user, we can use token 
//so we can run a middleware to check if the user is verified
router.post("/addnote",verifyToken,addNote); //when request comes on /addnotes route first middleware is run to verify token and then our logic is run
router.get("/getallnotes",verifyToken,getAllNotes);
router.put("/update/:noteId",verifyToken,updateNote);
router.delete("/delete/:noteId",verifyToken,deleteNote);
router.get("/getnote/:noteId",verifyToken,getNote);
module.exports=router;
