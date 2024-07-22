// import dotenv from 'dotenv'
const dotenv =require('dotenv') 
const mongoose =require('mongoose')
dotenv.config();

async function connectDB() {
  await mongoose.connect('mongodb+srv://mail1project1:team123456@cluster0.kcqny2i.mongodb.net/example')
 .then(()=>{
   console.log("DB is Connected");
 }) 
}
module.exports = connectDB