const userModel = require("../models/user");

exports.login = async (req, res, next) => {
  res.render('auth/login');
};

exports.logout = async (req, res, next) => {
  req.session.user_data = null;
  res.redirect('/login');
};

exports.register = async (req, res, next) => {
  res.render('auth/register');
};

exports.report = async (req, res, next) => {
  res.render('report');
};

exports.worker = async (req, res, next) => {
  res.render('worker');
};

exports.shipper = async (req, res, next) => {
  res.render('shipper');
};

exports.factory = async (req, res, next) => {
  res.render('factory');
};

exports.order = async (req, res, next) => {
  res.render('order');
};

exports.prediction = async (req, res, next) => {
  res.render('prediction');
};
