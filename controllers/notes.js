const client = require("../configs/db");

exports.addNote = (req, res) => {
  //what we will get from frontend ?
  /* 
     {
      heading:"heading1",
      content:"ajgahgiehghgjdha"
     }
  */

  const { heading, content } = req.body;
  //we can check here if heading and content are empty by checking their lengths
  //if they are empty we will send an error response
  //also we can make sure that nonempty stuff will come to backend
  client
    .query(
      `INSERT INTO notes(email,heading,content) VALUES ('${req.email}','${heading}','${content}');`
    )
    //we get email because middleware adds email to req it when checking token
    .then((data) => {
      return res.status(200).json({ message: "Note successfully added." });
    })
    .catch((err) => {
      console.log(err);
      return res.send(500).json({ message: "Database error." });
    });
};
exports.getAllNotes = (req, res) => {
  //our middleware adds email member to req object
  client
    .query(`SELECT * FROM notes WHERE email='${req.email}';`)
    .then((data) => {
      const noteData = data.rows;
      const filteredData = noteData.map((note) => {
        return {
          noteId: note.noteid,
          heading: note.heading,
          content: note.content,
        };
      });
      return res.status(200).json({
        message: "Successfully fetched your notes.",
        data: filteredData,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Internal server error.");
    });
};
exports.updateNote = (req, res) => {
  //we can get the parameters of the request using .params
  const {heading,content}=req.body //we will get new heading and content to update
  const noteId=req.noteId;
  client.query(`UPDATE notes SET heading='${heading}', content='${content}' WHERE noteid=${noteId};`)
  .then((data)=>{
    return res.status(200).json({message:"Note updated successfully."});
  })
  .catch((err)=>{
    console.log(err);
    return res.status(500).json({message:"Internal database error."});
  });
};
exports.deleteNote=(req,res)=>{
  client.query(`DELETE FROM notes where noteid=${req.noteId};`)
  .then((data)=>{
    res.status(200).json({message:"Note deleted successfully."});
  })
  .catch((err)=>{
    console.log(err);
    res.status(500).json({message:"Database error."});
  });
};
exports.getNote=(req,res)=>{
  const noteId=req.noteId; //middleware param gives us noteId
  //now we will make request to get info of particular note 
  client.query(`SELECT * FROM notes where noteid=${noteId};`)
  .then((data)=>{
    const noteData=data.rows[0];
    const filteredData={
      noteId:noteData.noteid,
      heading:noteData.heading,
      content:noteData.content,
    };
    return res.status(200).json({
      message:"Note fetched successfully",
      data:filteredData,
    });
  })
  .catch((err)=>{
    console.log(err);
    return res.status(500).json({message:"Internal server error."});
  });
}