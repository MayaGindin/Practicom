const crypto = require('crypto')
const common = require('./common');
const User = require('../models/user')

exports.list = async (req, res, next) => {
    result = await User.find().exec();

    common.response_success(res, result);
};

exports.deleteUser = async (req, res, next) => {
    result = await User.deleteOne({ _id: '648286e44b65d2fd975e4c89' });

    common.response_success(res, result);
};

exports.updateUser = async (req, res, next) => {
    let updateData = {
        "_id": "64828e9e866da7afa49f2b10",
        "email": "id@sd.s",
        "username": "name1",
        "password": "pass1",
    };

    let data = await User.findById(updateData._id);
    await data.updateOne(data);

    common.response_success(res);
};

exports.register = async (req, res) => {
    let { username, email, password } = req.body;

    let checkExist = await User.exists({ email });

    if (!checkExist) {
        password = crypto.createHash('md5').update(password).digest("hex")
        result = await User.create({ email, password, username, createdAt: new Date(Date.now() + 180 * 60 * 1000) });

        common.response_success(res, result);
    }
    else {
        common.response_error(res, 'Required email already exists.');
    }
}

exports.login = async (req, res) => {
    let { email, password } = req.body;

    password = crypto.createHash('md5').update(password).digest("hex");
    let data = await User.findOne({ email, password }).exec();
    console.log(data);

    if (data) {
        req.session.user_data = data;
        common.response_success(res);
    }
    else {
        common.response_error(res, 'Invalid Email or Password.');
    }
}


exports.datatable = async (req, res) => {
    let count = await User.count({});
    let recordsTotal = count;

    count = await User.count({
        $or: [
            { email: { $regex: '.*' + req.query.search.value + '.*' } },
            { username: { $regex: '.*' + req.query.search.value + '.*' } }
        ]
    });
    let recordsFiltered = count;
    console.log(req.query.search.value);

    let result = await User.find({
        $or: [
            { email: { $regex: '.*' + req.query.search.value + '.*' } },
            { username: { $regex: '.*' + req.query.search.value + '.*' } }
        ]
    })
        .skip(req.query.start)
        .limit(req.query.length);

    if (result) {
        var data = JSON.stringify({
            "draw": req.query.draw,
            "recordsFiltered": recordsFiltered,
            "recordsTotal": recordsTotal,
            "data": result
        });
        res.send(data);
        return;
    }
    else res.send(404);
};


exports.count = async () => {
    return await User.count({});
}
