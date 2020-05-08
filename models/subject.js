const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const subjectSchema = new Schema(
    {
        subjectTitle: { type: String, required: true },
        category: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },
        tutors: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        lessons: [
            {
                type: Schema.Types.ObjectId,
                ref: "Lesson"
            }
        ]
    }, { timestamps: true });



module.exports = mongoose.model("Subject", subjectSchema);
