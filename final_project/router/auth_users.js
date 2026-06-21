const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    let user_same_name= users.filter((user)=>{
        return user.username === username;
    });
    return user_same_name.length>0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let valid_user= users.filter((user)=>{
        return (user.username === username&&user.password === password);
    });
    return valid_user.length>0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password){
    return res.status(404).json({message: "error in logging in"})
  } 
  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
        data:password
    }, 'access',{expiresIn:60*60});
    req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("Login successful!");
  } else {
    return res.status(208).json({message:"invalid login, check username and password"});
  }
  
});

// Add a book review
regd_users.put("/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.status(200).send(`Review for ISBN ${isbn} added/updated successfully`);
}  else {
    return res.status(404).json({message: "book not found"});
} 
});
regd_users.delete("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    if(books[isbn]){
        if(books[isbn].reviews[username]){
            delete books[isbn].reviews[username];
            return res.status(200).send(`Review for ISBN ${isbn} deleted`);
        } else {
            return res.status(404).json({message: "no review found for user"});
        }
    }else {
        return res.status(404).json({message: "book not found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
