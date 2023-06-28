const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../configs/db");
/*
const temporaryData = [
  {
    name: "Rakesh",
    email: "rakhibodapatla@gmail.com",
    password: "$2b$10$cYh0nUOM2caEwKwIkrtBg.LZoLKL4dzgzyuEKncTKor7dL4juTUJm",
  },
  {
    name: "Pranay",
    email: "pranay@gmail.com",
    password: "$2b$10$cYh0nUOM2caEwKwIkrtBg.LZoLKL4dzgzyuEKncTKor7dL4juTUJm",
  },
  {
    name: "Sumeet",
    email: "sumeet@gmail.com",
    password: "$2b$10$cYh0nUOM2caEwKwIkrtBg.LZoLKL4dzgzyuEKncTKor7dL4juTUJm",
  },
  {
    name: "random",
    email: "random@gmail.com",
    password: "$2b$10$cYh0nUOM2caEwKwIkrtBg.LZoLKL4dzgzyuEKncTKor7dL4juTUJm",
  },
];
*/
exports.signUp = (req, res) => {
  //we are going to get a request from frontend with body like given below
  /*{
        name:"Rakesh",
        email:"rakhibodapatla@gmail.com",
        password:"rameshsuresh"
    }*/
  const { name, email, password } = req.body; //extracted the fields
  //res.send('all ok');

  //NOTE : check if the user already exists
  //const isValid = temporaryData.findIndex((ele) => ele.email === email);
  client
    .query(`SELECT * FROM users WHERE email='${email}'`)
    .then((data) => {
      const isValid = data.rows; //it is an array
      if (isValid.length != 0) {
        //user already exists
        return res.status(400).json({ error: "User already exists" });
      }

      //NOTE : generate token
      const token = jwt.sign({ email: email }, process.env.SECRET_KEY);

      //NOTE : hash password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
        //console.log(hash);
        //return res.status(200).send(hash);

        //add user to database and send token
        client
          .query(
            `INSERT INTO users(name,email,password) VALUES('${name}','${email}','${hash}')`
          )
          .then(() => {
            return res.status(200).json({
              message: "User added successfully",
              token: token,
            });
          })
          .catch((err) => {
            console.log(err);
            return res
              .status(500)
              .json({ message: "Internal database error." });
          });
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ message: "Internal database error." });
    });
};
exports.signIn = (req, res) => {
  const { email, password } = req.body;
  //NOTE: check if the email is valid
  client
    .query(`SELECT * FROM users WHERE email='${email}'`)
    .then((data) => {
      const isValid2 = data.rows;
      //if user is not found return error
      if (isValid2.length == 0) {
        return res.status(400).json({ message: "User doesn't exist." });
      } else {
        //user exists so check the password
        const realPassword = isValid2[0].password;
        bcrypt
          .compare(password, realPassword)
          .then((result) => {
            if (result) {
              //password is correct send token 
              const token=jwt.sign({email:email},process.env.SECRET_KEY);
              return res
                .status(200)
                .json({ message: "Logged in successfully.",token:token });
            } else {
              //password is incorrect
              return res.status(400).json({ message: "Incorrect password." });
            }
          })
          .catch((err) => {
            console.log(err);
            return res.status(500).json({ message: "Internal error." });
          });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.send(500).json({ message: "Internal error." });
    });
};
