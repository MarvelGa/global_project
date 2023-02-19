const express = require('express');
const Feedback = require('../models/Feedback')
const router = express.Router();
const authentication = require("../security/userAuthenticate");

module.exports = () => {
    router.get('/', authentication, async (request, response, next) => {
        try {
            const successMessage = request.session.feedback ? request.session.feedback.message : false;
            request.session.feedback = {};
            let feedback = [];
            const userEmail = request.session.user;
            for await (const feedbackInfo of Feedback.find()) {
                feedback.push({
                    'id':feedbackInfo.id,
                    'name': feedbackInfo.name,
                    'email': feedbackInfo.email,
                    'title': feedbackInfo.title,
                    'message': feedbackInfo.message
                });
            }
            return response.render('feedback', {
                pageTitle: 'Feedback',
                template: 'feedback',
                feedback,
                successMessage,
                userEmail
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
    });
    return router;
};
