const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.logIn = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || email.trim() == '' || !password || password.trim() == '')
        return res.status(404).send({
            status: false,
            message: "Email and Password required"
        });
    User.findOne({ email: email.trim().toLowerCase() }, { createdAt: 0, updatedAt: 0, __v: 0 })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    status: false,
                    message: "Incorrect username or password, please review details and try again"
                });
            }
            if (user.active && user.active != 'Y') {
                return res.status(404).send({
                    status: false,
                    message: "User account Deactivated"
                });
            }
            bcrypt.compare(password, user.password).then(valid => {
                if (!valid) {
                    return res.status(403).send({
                        status: false,
                        message: "Incorrect username or password, please review details and try again"
                    });
                }
                user['password'] = undefined;
                req.session = {};
                req.session.userData = {
                    email: user.email,
                    _id: user._id,
                    roles: user.roles
                };
                res.data = user;
                res.data.status = true;

                next();
            });
        })
        .catch(err => console.log(err));
}

