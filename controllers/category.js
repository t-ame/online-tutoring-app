const jwt = require("jsonwebtoken");
const User = require("../models/category");


exports.updateCategory = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).send({
                    status: false,
                    message: "User not found, please provide valid credentials"
                });
            }
            bcrypt.compare(password, user.password).then(valid => {
                if (!valid) {
                    return res.status(403).send({
                        status: false,
                        message: "Incorrect username or password, please review details and try again"
                    });
                }
                const token = jwt.sign(
                    { email: user.email, _id: user._id, roles: user.roles },
                    "mysecretkey",
                    { expiresIn: "1hr" }
                );
                res.status(200).send({
                    status: true,
                    _id: user._id,
                    token
                });
            });
        })
        .catch(err => console.log(err));
}