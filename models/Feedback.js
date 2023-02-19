const mongoose =require('mongoose');

const FeedbackSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
});

module.exports= new mongoose.model("Feedback", FeedbackSchema)
