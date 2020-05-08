const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var catEnum = {
    values: ['Primary', 'JSS', 'SSS'],
    message: "Valid categories are: 'Primary', 'JSS', 'SSS'."
}



const categorySchema = new Schema(
    {
        categoryName: {
            type: String,
            enum: catEnum,
            required: true
        },
        subjects: [
            {
                type: Schema.Types.ObjectId,
                ref: "Subject"
            }
        ],
        students: [
            {
                type: Schema.Types.ObjectId,
                ref: "User"
            }
        ]
    }, { timestamps: true });



module.exports = mongoose.model("Category", categorySchema);
