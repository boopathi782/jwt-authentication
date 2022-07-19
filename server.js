const express = require("express");
const bodyParser = require('body-parser');
const jwt =  require("jsonwebtoken");
let referesh_token_data = [];


app = express ();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



function auth(req,res, next){
        let token =req.headers["authorization"];
        token = token.split(' ')[1];
        jwt.verify(token, "Acccesss", (err, user)=>{
                if(!err){
                        req.user = user;
                        next();
                }
                else{
                        return  res.status(401).json({message: "user not authenticated  "})
                }
        });
}

app.post("/referesh_token", (req,res)=>{
  const refereshToken =  req.body.token;  
  
  if(!refereshToken || !referesh_token_data.includes(refereshToken)){
        return  res.status(401).json({message: "user not authenticated  "})      
  }
  jwt.verify(refereshToken, "Referesh", (err, user)=>{
          if(!err){
                const accessToken =  jwt.sign({ username:user.name }, 'Acccesss', {expiresIn: "20s"} );
                return  res.status(200).json(accessToken)
            }else {
                return  res.status(401).json({message: "user not authenticated  "})      
            }
  });


});




app.post("/login", (req, res)=>{
    const { user } = req.body;  

    console.log( req.body) 
    if(!req.body) {
        // console.log('Object missing');
        return res.status(404).json({message: "Object missing" }); 
     }else{
        // return res.status(404).json({message: user });  
 
        let accessToken =  jwt.sign({user}, 'Acccesss', {expiresIn: "20s"} );
        let refereshToken = jwt.sign({user},'Referesh', {expiresIn: "7d"});
        
        referesh_token_data.push(refereshToken);

        return  res.status(200). json({
        accessToken,
        refereshToken
        });
     } 
});
 
app.post("/protected", auth, (req,res)=>{

        res.send("protected route")
})

app.listen(4000,()=>{
        console.log("Example app listening server running ");
});


