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
                    'id': feedbackInfo.id,
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
                userEmail,
                congratsMessage: ""
            });
        } catch (err) {
            return next(err);
        }
    });

    router.post('/', (request, response) => {
        const email = request.session.user.email;
        const {name, title, message} = request.body;
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

    router.get('/delete/:id', authentication, (request, response) => {
        Feedback
            .deleteOne({_id: request.params.id})
            .then(() => {
                request.session.feedback = {
                    message: 'The comment was deleted!',
                };
                return response.redirect("/feedback");
            })
            .catch((err) => console.log(err));
    });

    router.get('/edit/:id', authentication, async (request, response, next) => {
        try {
            const foundFeedback = await Feedback.findOne({_id: request.params.id});
            let userCurrentFeedback;
            if (foundFeedback) {
                userCurrentFeedback = {
                    'id': foundFeedback.id,
                    'name': foundFeedback.name,
                    'email': foundFeedback.email,
                    'title': foundFeedback.title,
                    'message': foundFeedback.message
                }
            } else {
                return response.send(`Cant find user with this id=${request.params.id}`)
            }
            return response.render("editFeedback", {
                userCurrentFeedback
            });
        } catch (err) {
            return next(err);
        }
    });

    router.post('/edit/:id', authentication, async (request, response, next) => {
        try {
            const {name, title, message} = request.body;
            const result = await Feedback.updateOne({_id: request.params.id}, {
                name: name,
                title: title,
                message: message
            });
            if (result) {
                request.session.feedback = {
                    message: 'The comment was successfully updated!',
                };
                return response.redirect("/feedback");
            }
        } catch (err) {
            return next(err);
        }
    });

    return router;
};
