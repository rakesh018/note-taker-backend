const jwt=require("jsonwebtoken");
const client = require("../configs/db");
exports.verifyToken=(req,res,next)=>{
    const token=req.headers.authorization;
    jwt.verify(token,process.env.SECRET_KEY,(err,decoded)=>{
        if(err){
           return res.status(400).json({message:"Invalid token."});
        }
        else{
            //we will recheck if the email in the token is valid mail or not
            const userEmail=decoded.email;
            client.query(`SELECT * FROM users WHERE email='${userEmail}'`)
            .then((result)=>{
                if(result.rows.length===0){
                    return res.status(400).json({message:"Invalid request."});
                }
                else{
                    req.email=userEmail;
                    //we are adding a member to req object so that we can access this email in the next part 
                    next();
                    //continue with the logic because user's token is verified properly
                }
            })
            .catch(err=>{
                return res.status(500).json({message:"Internal server error."});
            });
        }
    });
}