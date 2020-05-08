const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Category = require("../models/category");
const Subject = require("../models/subject");
const { isUserAdmin, isUserTutor } = require("../utils/apputils");

exports.signUp = (req, res, next) => {
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const roles = [req.body.role];

    if (!firstname || !lastname || !email || !password || !roles[0]) {
        res.status(400).send({
            status: false,
            message: "All fields are required"
        });
        return;
    }
    if (roles[0].toLowerCase() == 'admin') {
        res.status(400).send({
            status: false,
            message: "Cannot register an Admin"
        });
        return;
    }
    try {
        User.findOne({ email: email.trim().toLowerCase() }, (err, user) => {
            if (err)
                return res.status(404).send({
                    status: false,
                    message: err.message
                });
            if (user)
                return res.status(423)
                    .send({ status: false, message: "This email already exists" });

            bcrypt.hash(password, 12)
                .then(password => {
                    let user = new User({
                        firstname,
                        lastname,
                        email,
                        password,
                        roles,
                        active: 'Y'
                    });
                    return user.save();
                })
                .then(() => {
                    res.data = "User registered successfully";
                    next();
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).send({
                        status: false,
                        message: err.message
                    });
                });

        });

    } catch (err) {
        console.log(err);
        return res.status(404).send({
            status: false,
            message: err.message
        });
    }
};

exports.updateUserByUsername = (req, res, next) => {
    const email = req.params.username;
    const newData = req.body;

    const userData = req.session.userData;
    const currEmail = res.currentUserEmail;
    if (currEmail && email.trim().toLowerCase() != currEmail.trim().toLowerCase() && !isUserAdmin(userData))
        return res.status(401).send({
            status: false,
            message: "Unauthorized access."
        });

    try {
        User.updateOne({ email }, newData, (err, result) => {
            if (err || result.n < 1)
                return res.status(404).send({
                    status: false,
                    message: err ? err.message : "User not found, please provide valid credentials"
                });
            res.data = "User updated successfully";
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

exports.updateUserById = (req, res, next) => {
    const userID = req.params.userID;
    const newData = req.body;

    const userData = req.session.userData;
    const currId = res.currentUserId;
    if (currId && email.trim().toLowerCase() != currId.trim().toLowerCase() && !isUserAdmin(userData))
        return res.status(401).send({
            status: false,
            message: "Unauthorized access."
        });
    try {
        User.findByIdAndUpdate(userID, newData, (err, result) => {
            if (err || result.n < 1)
                return res.status(404).send({
                    status: false,
                    message: err ? err.message : "User not found, please provide valid credentials"
                });
            res.data = "User updated successfully";
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

exports.getUserById = (req, res, next) => {
    const userID = req.params.userID;

    const userData = req.session.userData;
    const currId = res.currentUserId;
    if (currId && email.trim().toLowerCase() != currId.trim().toLowerCase() && !isUserAdmin(userData))
        return res.status(401).send({
            status: false,
            message: "Unauthorized access."
        });

    try {
        User.findById(userID, (err, user) => {
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
            delete user.password;
            res.status(200).send(user);
        })
    } catch (err) {
        console.log(err);
        return res.status(404).send({
            status: false,
            message: err.message
        });
    }
}

exports.getUserSubjects = (req, res, next) => {
    let email = req.params.username;

    const userData = req.session.userData;
    const currEmail = res.currentUserEmail;
    if (currEmail && email.trim().toLowerCase() != currEmail.trim().toLowerCase() && !isUserAdmin(userData))
        return res.status(401).send({
            status: false,
            message: "Unauthorized access."
        });

    try {
        User.findOne({ email: email.trim().toLowerCase() }, (err, user) => {
            if (err)
                return res.status(404).send({
                    status: false,
                    message: err.message
                });
            subjects = [];
            for (let subject in user.subjects) {
                Subject.findById(subject, (err, sub) => {
                    if (err) throw err;
                    subjects.push(sub);
                });
            }
            res.status(200).send(subjects);
        });
    } catch (err) {
        console.log(err);
        return res.status(404).send({
            status: false,
            message: err.message
        });
    }
}

exports.getUserCategories = (req, res, next) => {
    let email = req.params.username;

    const userData = req.session.userData;
    const currEmail = res.currentUserEmail;
    if (currEmail && email.trim().toLowerCase() != currEmail.trim().toLowerCase() && !isUserAdmin(userData))
        return res.status(401).send({
            status: false,
            message: "Unauthorized access."
        });
        
    try {
        User.findOne({ email: email.trim().toLowerCase() }, (err, user) => {
            if (err)
                return res.status(404).send({
                    status: false,
                    message: err.message
                });
            categories = [];
            for (let category in user.categories) {
                Category.findById(category, (err, cat) => {
                    if (err) throw err;
                    categories.push(cat);
                });
            }
            res.status(200).send(categories);
        });
    } catch (err) {
        console.log(err);
        return res.status(404).send({
            status: false,
            message: err.message
        });
    }
}


//MAKE A TUTOR AN ADMIN... NOT FOR ROUTE, TO BE CALLED INSIDE APPLICATION!
exports.makeTutorAdmin = (email) => {
    if (!email) {
        console.log("Email Required");
        return;
    }
    User.findOne({ email })
        .then(user => {
            if (!user)
                throw "User not found, please provide valid credentials";
            if (user.roles.filter((role) => role == 'Admin').length > 0)
                throw "User is already an Admin.";
            if (user.roles.filter((role) => role == 'Tutor').length < 1)
                throw "Only Tutors can be made Admin.";
            user.roles.push('Admin');
            User.updateOne({ _id: user._id }, { $set: { roles: user.roles } })
                .then(() => console.log("User updated successfully"));
        })
        .catch(err => console.log(err));
}