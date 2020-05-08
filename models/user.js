const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var roleEnum = {
    values: ['Admin', 'Tutor', 'Student'],
    message: "Valid user roles are: 'Tutor', 'Student'."
}

const userSchema = new Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        email: { type: String, required: true, lowercase: true, trim: true, unique: true },
        password: { type: String, required: true },
        active: { type: String, required: true },
        roles: [
            {
                type: String,
                enum: roleEnum,
                required: true
            }
        ],
        categories: [
            {
                type: Schema.Types.ObjectId,
                ref: "Category"
            }
        ],
        subjects: [
            {
                type: Schema.Types.ObjectId,
                ref: "Subject"
            }
        ]
    }, { timestamps: true });



module.exports = mongoose.model("User", userSchema);
