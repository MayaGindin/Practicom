const common = require('./common');
const Factory = require("../models/factory");

exports.add = async (req, res) => {
    let { name, email, phone, category } = req.body;

    let checkExist = await Factory.exists({ email });

    if (!checkExist) {
        result = await Factory.create({ email, name, phone, category, createdAt: new Date(Date.now() + 180 * 60 * 1000) });

        common.response_success(res, result);
    }
    else {
        common.response_error(res, 'Required email already exists.');
    }
}


exports.datatable = async (req, res, next) => {
    let count = await Factory.count({});
    let recordsTotal = count;
    let filter = {
        $or: [
            { category: { $regex: '.*' + req.query.search.value + '.*' } },
            { phone: { $regex: '.*' + req.query.search.value + '.*' } },
            { email: { $regex: '.*' + req.query.search.value + '.*' } },
            { name: { $regex: '.*' + req.query.search.value + '.*' } }
        ]
    };

    count = await Factory.count(filter);
    let recordsFiltered = count;

    let result = await Factory.find(filter)
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

exports.list = async (req, res) => {
    let result = await Factory.find({});

    common.response_success(res, result);
}

exports.count = async () => {
    return await Factory.count();
}

exports.import = async (data) => {
    await Factory.create(data);
}