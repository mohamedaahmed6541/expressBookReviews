const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (username && password){
    if (!isValid(username)){
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "user succesfully registerd"});
    } else{
        return res.status(404).json({message: "user already exists"});
    }
  }
  return res.status(404).json({message: "unable to register , username and password are required"});
});
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).send(JSON.stringify(books[isbn], null, 4));
});

// Get the book list available in the shop
public_users.get('/async-isbn/:isbn',async function (req, res) {
  //Write your code here
  try{
    const isbn= req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).send(JSON.stringify(response.data, null, 4));
} catch(error){
    return res.status(500).json({ message: "Error fetching book", error: error.message });
}
});

// Get book details based on ISBN
public_users.get('/async-books',async function (req, res) {
  //Write your code here
  try{
    const response = await axios.get('http://localhost:5000/');
    return res.status(200).send(JSON.stringify(response.data, null,4));
    } catch (error){
        return res.status(500).json({message: "error fetching book", error: error.message});
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author =req.params.author;
  const book_Keys= Object.keys(books);
  let books_Author =[];
  book_Keys.forEach((key)=>{
    if (books[key].author ===author){
        books_Author.push(books[key]);
    }
  });
  return res.status(200).send(JSON.stringify(books_Author, null,4));
});

public_users.get('/async-author/:author',async function (req, res) {
    //Write your code here
    try{
      const author= req.params.author;
      const response = await axios.get(`http://localhost:5000/author/${author}`);
      return res.status(200).send(JSON.stringify(response.data, null, 4));
  } catch(error){
      return res.status(500).json({ message: "Error fetching book by author", error: error.message });
  }
  });
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title =req.params.title;
  const book_Keys= Object.keys(books);
  let books_Title =[];
  book_Keys.forEach((key)=>{
    if (books[key].title ===title){
        books_Title.push(books[key]);
    }
  });
  return res.status(200).send(JSON.stringify(books_Title, null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn =req.params.isbn;
  return res.status(200).send(JSON.stringify(books[isbn].reviews, null,4));
});

module.exports.general = public_users;
