const Category = require("../models/category");
const Subject = require("../models/subject");
const { isUserAdmin, isUserTutor } = require("../utils/apputils");

exports.addCategory = (req, res, next) => {
    const catName = req.body.catname;
    const subjects = req.body.subjects;
    if (!catName || !subjects) {
        res.status(400).send({
            status: false,
            message: "Category name and Subjects required"
        });
        return;
    }
    try {
        Category.findOne({ categoryName: catName.trim() }, (err, cat) => {
            if (err)
                return res.status(404).send({
                    status: false,
                    message: err.message
                });
            if (cat)
                return res.status(423)
                    .send({ status: false, message: "This category already exists" });
            let category = new Category({
                categoryName: catName,
                subjects: subjects,
                students: []
            });
            category.save()
                .then(() => {
                    res.data = "Category added successfully";
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
}

exports.getAll = (req, res, next) => {
    try {
        Category.find({}, { subjects: 0, students: 0, createdAt: 0, updatedAt: 0, __v: 0 }, (err, result) => {
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

exports.getCategoryByName = (req, res, next) => {
    const catname = req.params.catname;

    try {
        Category.findOne({ categoryName: catname }, { students: 0, createdAt: 0, updatedAt: 0, __v: 0 }, (err, category) => {
            if (err)
                return res.status(404).send({
                    status: false,
                    message: err.message
                });
            if (!category)
                return res.status(404).send({
                    status: false,
                    message: "Category does not exist"
                });
            let subs = category.subjects;
            let subjects = [];
            for (let sub in subs) {
                Subject.findById(sub, { tutors: 0, students: 0, lessons: 0, createdAt: 0, updatedAt: 0, __v: 0 }, (err, result) => {
                    if (err)
                        return res.status(404).send({
                            status: false,
                            message: err.message
                        });
                    subjects.push(result);
                });
            }
            category.subjects = subjects;
            res.data = category;
            next();
        })
    } catch (err) {
        console.log(err);
        return res.status(404).send({
            status: false,
            message: err.message
        });
    }
}

exports.getCategoryById = (req, res, next) => {
    const catId = req.params.catId;

    try {
        Category.findById(catId, { students: 0, createdAt: 0, updatedAt: 0, __v: 0 }, (err, category) => {
            if (err)
                return res.status(404).send({
                    status: false,
                    message: err.message
                });
            if (!category)
                return res.status(404).send({
                    status: false,
                    message: "Category does not exist"
                });
            let subs = category.subjects;
            let subjects = [];
            for (let sub in subs) {
                Subject.findById(sub, { tutors: 0, students: 0, lessons: 0, createdAt: 0, updatedAt: 0, __v: 0 }, (err, result) => {
                    if (err)
                        return res.status(404).send({
                            status: false,
                            message: err.message
                        });
                    subjects.push(result);
                });
            }
            category.subjects = subjects;
            res.data = category;
            next();
        })
    } catch (err) {
        console.log(err);
        return res.status(404).send({
            status: false,
            message: err.message
        });
    }
}

exports.getSubjectsByCatName = (req, res, next) => {
    const catname = req.params.catname;

    try {
        Category.findOne({ categoryName: catname }, (err, category) => {
            if (err)
                return res.status(404).send({
                    status: false,
                    message: err.message
                });
            if (!category)
                return res.status(404).send({
                    status: false,
                    message: "Category does not exist"
                });
            let subs = category.subjects;
            let subjects = [];
            for (let sub in subs) {
                Subject.findById(sub, { tutors: 0, students: 0, lessons: 0, createdAt: 0, updatedAt: 0, __v: 0 }, (err, result) => {
                    if (err)
                        return res.status(404).send({
                            status: false,
                            message: err.message
                        });
                    subjects.push(result);
                });
            }
            res.data = subjects;
            next();
        })
    } catch (err) {
        console.log(err);
        return res.status(404).send({
            status: false,
            message: err.message
        });
    }
}

exports.getSubjectsByCatId = (req, res, next) => {
    const catId = req.params.catId;

    try {
        Category.findById(catId, (err, category) => {
            if (err)
                return res.status(404).send({
                    status: false,
                    message: err.message
                });
            if (!category)
                return res.status(404).send({
                    status: false,
                    message: "Category does not exist"
                });
            let subs = category.subjects;
            let subjects = [];
            for (let sub in subs) {
                Subject.findById(sub, { tutors: 0, students: 0, lessons: 0, createdAt: 0, updatedAt: 0, __v: 0 }, (err, result) => {
                    if (err)
                        return res.status(404).send({
                            status: false,
                            message: err.message
                        });
                    subjects.push(result);
                });
            }
            res.data = subjects;
            next();
        })
    } catch (err) {
        console.log(err);
        return res.status(404).send({
            status: false,
            message: err.message
        });
    }
}

exports.deleteCategoryByName = (req, res, next) => {
    const catname = req.params.catname;

    try {
        Category.findOne({ categoryName: catname }, { students: 0, createdAt: 0, updatedAt: 0, __v: 0 }, (err, category) => {
            if (err)
                return res.status(404).send({
                    status: false,
                    message: err.message
                });
            if (!category)
                return res.status(404).send({
                    status: false,
                    message: "Category does not exist"
                });
            for (let subject in category.subjects) {
                Subject.findByIdAndDelete(subject, (err, result) => {
                    if (err)
                        return res.status(404).send({
                            status: false,
                            message: err.message
                        });
                });
            }
            Category.findByIdAndDelete(category._id, (err, result) => {
                if (err)
                    return res.status(404).send({
                        status: false,
                        message: err.message
                    });
                res.data = "Category deleted successfully.";
                next();
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(404).send({
            status: false,
            message: err.message
        });
    }
}

exports.deleteCategoryById = (req, res, next) => {
    const catId = req.params.catId;

    try {
        Category.findById(catId, (err, result) => {
            if (err)
                return res.status(404).send({
                    status: false,
                    message: err.message
                });
            if (!result)
                return res.status(404).send({
                    status: false,
                    message: "Category does not exist"
                });
            for (let subject in category.subjects) {
                Subject.findByIdAndDelete(subject, (err, result) => {
                    if (err)
                        return res.status(404).send({
                            status: false,
                            message: err.message
                        });
                });
            }
            Category.findByIdAndDelete(category._id, (err, result) => {
                if (err)
                    return res.status(404).send({
                        status: false,
                        message: err.message
                    });
                res.data = "Category deleted successfully.";
                next();
            });
        });
    } catch (err) {
        console.log(err);
        return res.status(404).send({
            status: false,
            message: err.message
        });
    }
}