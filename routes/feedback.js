const express = require('express');
const Feedback = require('../models/Feedback')
const User = require("../models/User");
const {List} = require("collections/list");
const router = express.Router();

module.exports = () => {
  router.get('/', async (request, response, next) => {
    if (!request.session.user){
      response.send("You are not allowed to visit this page! Please, logged in!");
      return;
    }
    try {
      const successMessage = request.session.feedback ? request.session.feedback.message : false;
      request.session.feedback = {};
      let feedback  = [];
      for await (const feedbackInfo of Feedback.find()) {
        feedback.push({'name':feedbackInfo.name,'feedback': feedbackInfo.email,'title': feedbackInfo.title,'message': feedbackInfo.message});
      }
      return response.render('feedback', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
        successMessage
      });
    } catch (err) {
      return next(err);
    }
  });

  router.post('/', (request, response) => {
    const {name, email, title, message} = request.body;
    const newFeedBack = new Feedback({name, email, title, message});
    newFeedBack
        .save()
        .then(() => {
          request.session.feedback = {
            message: 'Thank you for your feedback!',
          };
         return response.redirect("/feedback");
        })
        .catch((err) => console.log(err));
    // return response.send('Feedback form posted');
  });

  return router;
};
