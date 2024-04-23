const common = require('./common');
const Shipper = require("../models/shipper");

exports.add = async (req, res) => {
    let { name, email, phone } = req.body;

    let checkExist = await Shipper.exists({ email });

    if (!checkExist) {
        result = await Shipper.create({ email, name, phone, createdAt: new Date(Date.now() + 180 * 60 * 1000) });

        common.response_success(res, result);
    }
    else {
        common.response_error(res, 'Required email already exists.');
    }
}


exports.datatable = async (req, res, next) => {
    let count = await Shipper.count({});
    let recordsTotal = count;
    let filter = {
        $or: [
            { phone: { $regex: '.*' + req.query.search.value + '.*' } },
            { email: { $regex: '.*' + req.query.search.value + '.*' } },
            { name: { $regex: '.*' + req.query.search.value + '.*' } }
        ]
    };

    count = await Shipper.count(filter);
    let recordsFiltered = count;

    let result = await Shipper.find(filter)
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
    let result = await Shipper.find({});

    common.response_success(res, result);
}

exports.count = async () => {
    return await Shipper.count();
}

exports.import = async (data) => {
    await Shipper.create(data);
}