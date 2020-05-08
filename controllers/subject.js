const Category = require("../models/category");
const Subject = require("../models/subject");
const { isUserAdmin, isUserTutor } = require("../utils/apputils");


exports.getAll = (req, res, next) => {
    try {
        User.find({}, { categories: 0, subjects: 0, password: 0, createdAt: 0, updatedAt: 0, __v: 0 }, (err, result) => {
            if (err)
                return res.status(404).send({
                    status: false,
                    message: err.message
                });
            res.data = result;
            next();
        });
    } catch (err) {
        console.log(err);
        return res.status(404).send({
            status: false,
            message: err.message
        });
    }
}

exports.getUserByUsername = (req, res, next) => {
    const email = req.params.username;
    
    const userData = req.session.userData;
    const currEmail = res.currentUserEmail;
    if (currEmail && email.trim().toLowerCase() != currEmail.trim().toLowerCase() && !isUserAdmin(userData))
        return res.status(401).send({
            status: false,
            message: "Unauthorized access."
        });

    try {
        User.findOne({ email }, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }, (err, user) => {
            if (err)
                return res.status(404).send({
                    status: false,
                    message: err.message
                });
            if (!user)
                return res.status(404).send({
                    status: false,
                    message: "User not found, please provide valid credentials"
                });
            res.data = user;
            next();
            // res.status(200).send(user);
        })
    } catch (err) {
        console.log(err);
        return res.status(404).send({
            status: false,
            message: err.message
        });
    }
}