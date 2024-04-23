const common = require('./common');
const Order = require("../models/order");
const Factory = require("../models/factory");
const Shipper = require("../models/shipper");
const sendEmail = require('../utils/sendEmail');

exports.add = async (req, res) => {
  let { item_title, item_description, quantity, order_date, address, price, factory_id, shipper_id } = req.body;

  let factory = await Factory.findById(factory_id);
  let shipper = await Shipper.findById(shipper_id);

  if (factory && shipper) {
    result = await Order.create({ item_title, item_description, quantity, order_date, address, price, factory: factory, shipper: shipper, status: 'In production', createdAt: new Date(Date.now() + 180 * 60 * 1000) });

    try {
      sendEmail({
        //the factory email 
        to: factory.email,
        //sendGrid sender id 
        from: 'mimoma9999@gmail.com',
        subject: 'New Factory Order',
        text: 'Glad you are here .. yes you!',
        html: `<h2>New Order For Production:</h2>
                        Hello ${factory.name}, New order is confirmed for production:<br>
                        item_title: ${item_title}<br>
                        item_description: ${item_description}<br>
                        quantity: ${quantity}<br>
                        order_date: ${order_date}<br>
                        Please update us once the item is ready to pick up.
                `

      });

      sendEmail({
        //the shipper email 
        to: shipper.email,
        //sendGrid sender id 
        from: 'mimoma9999@gmail.com',
        subject: 'New Shipment Order',
        text: 'Glad you are here .. yes you!',
        html: `<h2>New Shipment Order</h2>
                        Hello, we just got a new order going to production:<br>
                        item_title: ${item_title}<br>
                        item_description: ${item_description}<br>
                        quantity: ${quantity}<br>
                        order_date: ${order_date}<br>
                        address: ${address}<br>
                        Once the order finished production, please pick it up from the factory ${factory.name}<br>
                        Thank you.
                `
      });

      sendEmail({
        //the sales manager email 
        to: 'Mayagindin2@gmail.com',
        //sendGrid sender id 
        from: 'mimoma9999@gmail.com',
        subject: 'New Order Confirmation',
        text: 'Glad you are here .. yes you!',
        html: `<h2>New Order</h2>
                        New order confirmed!<br>
                        The order is moved to production<br>
                        This is the order details:<br>
                        item_title: ${item_title}<br>
                        item_description: ${item_description}<br>
                        quantity: ${quantity}<br>
                        order_date: ${order_date}<br>
                        address: ${address}<br>
                        price: ${price}<br>
                        <br>
                `
      });
    }
    catch (e) {

    }

    common.response_success(res, result);
  }
  else {
    common.response_error(res, 'Factory or Shipper Data Error.');
  }
}


exports.datatable = async (req, res, next) => {
  let { startDate, endDate } = req.query;
  console.log(startDate);
  console.log(endDate);

  let count = await Order.count({});
  let recordsTotal = count;
  let filter = startDate ? {
    $and: [      {
        $or: [{ item_title: { $regex: '.*' + req.query.search.value + '.*' } },
        { item_description: { $regex: '.*' + req.query.search.value + '.*' } },
        { quantity: req.query.search.value },
        { address: { $regex: '.*' + req.query.search.value + '.*' } },
        { status: { $regex: '.*' + req.query.search.value + '.*' } }
        ]},{
        order_date: { $gte: new Date(startDate), $lt: new Date(endDate) }
      }]} :{
      $and: [
        {
          $or: [{ item_title: { $regex: '.*' + req.query.search.value + '.*' } },
          { item_description: { $regex: '.*' + req.query.search.value + '.*' } },
          { quantity: req.query.search.value },
          { address: { $regex: '.*' + req.query.search.value + '.*' } },
          { status: { $regex: '.*' + req.query.search.value + '.*' } }
          ]}]
    };

  count = await Order.count(filter);
  let recordsFiltered = count;
  let sort = { order_date: -1 };
  let result = await Order.find(filter)
    .sort(sort)
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

exports.update = async (req, res) => {
  const { _id, status } = req.body;

  let data = await Order.findOneAndUpdate({ _id }, { status });

  common.response_success(res);
}

exports.firstYear = async (req, res) => {
  let data = await Order.findOne().sort({ order_date: 1 });

  if (!data) {
    common.response_success(res, 'null');
    return;
  }
  let first_date = new Date(data.order_date);
  common.response_success(res, first_date.getFullYear());
}

exports.prediction = async (req, res) => {
  let currentDate = new Date();
  let res_data = [];
  let i;
  for (i = 1; i <= 12; i++) {
    let str;
    if (i < currentDate.getMonth() + 1)
      str = currentDate.getFullYear() + "-" + (i < 10 ? "0" : "") + i;
    else str = currentDate.getFullYear() + "-" + (i < 10 ? "0" : "") + i;

    res_data.push({ month: str, prediction: 0 });
  }

  let lastYear = currentDate.getFullYear() - 1;
  let data = await Order.aggregate([
    {
      $match: {
        order_date: {
          $gte: new Date(lastYear, 0, 1),
          $lt: new Date(lastYear, 12, 1),
        },
      },
    },
    {
      $project: {
        month: { $substr: ["$order_date", 5, 2] },
        quantity: "$quantity",
      },
    },
    {
      $group: {
        _id: "$month",
        tot: { $sum: "$quantity" },
      },
    },
  ]);

  for (sub of data) {
    let mm = Number(sub._id);
    res_data[mm - 1].prediction = Math.round(sub.tot * 1.1);
  }

  common.response_success(res, res_data);
};


exports.count = async () => {
  return await Order.count({});
}

exports.import = async (data) => {
  await Order.create(data);
}