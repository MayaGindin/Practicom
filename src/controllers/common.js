
const send_response = (res, code, msg = '', data = null) => {
  res
    .status(200)
    .json({
      result_code: code,
      result_msg: msg,
      result_data: data
    })
    .end();
}

exports.response_success = (res, data, code = 'success') => {
  send_response(
    res,
    code,
    'success',
    data
  );
}

exports.response_error = (res, msg = '', code = 'error', data = null) => {
  send_response(
    res,
    code,
    msg,
    data
  );
}

exports.response_param_empty = (res, msg = '') => {
  send_response(
    res,
    'param_empty',
    'request_param_empty' + ":" + msg
  );
}
