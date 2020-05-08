const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const lessonSchema = new Schema(
    {
        lessontime: { type: Date, min: Date.now },
        durationInMinutes: Number,
        subject: {
            type: Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        },
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    }, { timestamps: true });



module.exports = mongoose.model("Lesson", lessonSchema);
