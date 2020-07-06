var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var Kavenegar = require('kavenegar');
//
global.admin = require("firebase-admin");
global.shared = require('./public/javascripts/common');
global.Kavenegar_api = Kavenegar.KavenegarApi({
    apikey: "4562754155412F7A754A507A383174387253324746413D3D"
});

// Fetch the service account key JSON file contents
var serviceAccount = require("./public/javascripts/eram-1b5d7-firebase-adminsdk-7kmwn-b21ec82fbe.json");


// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://eramhotel-9a637.firebaseio.com"
});

global.util = require('util');
var index = require('./routes/index');
var get_last_version =  require('./routes/get_last_version');
var sign_out = require('./routes/sign_out');
var sign_up = require('./routes/sign_up');
var sign_out_rest = require('./routes/sign_out_rest');
var check_activation_code = require('./routes/check_activation_code');
var check_activation_code_rest = require('./routes/check_activation_code_rest');
var check_activation_code_with_image = require('./routes/check_activation_code_with_image');
var set_password = require('./routes/set_password');
var set_password_rest = require('./routes/set_password_rest');
var login =  require('./routes/login');
var login_varzeshsoft =  require('./routes/login_varzeshsoft');
var login_rest =  require('./routes/login_rest');
var get_cities_list = require('./routes/get_cities_list');
var get_all_services = require('./routes/get_all_services');
var get_main_service_detailes = require('./routes/get_main_service_detailes');
var get_main_service_detailes_service = require('./routes/get_main_service_detailes_service');
var get_sub_service_detailes = require('./routes/get_sub_service_detailes');
var get_sub_service_detailes_service = require('./routes/get_sub_service_detailes_service');
var get_credit_service_detailes = require('./routes/get_credit_service_detailes');
var get_credit_service_detailes_service = require('./routes/get_credit_service_detailes_service');
var get_factor = require('./routes/get_factor');
var get_factor_detailes = require('./routes/get_factor_detailes');
var get_transaction = require('./routes/get_transaction');
var get_transaction_web = require('./routes/get_transaction_web');
var send_evaluate_notify = require('./routes/send_evaluate_notify');
var set_evaluate_rate = require('./routes/set_evaluate_rate');
var set_token = require('./routes/set_token');
var set_token_with_device_type =  require('./routes/set_token_with_device_type');
var set_image_user = require('./routes/set_image_user');
var send_message_with_sms = require('./routes/send_message_with_sms');
var send_message_with_notification = require('./routes/send_message_with_notification');
var send_message_to_all_with_notification = require('./routes/send_message_to_all_with_notification');
var send_verify_sms = require('./routes/send_verify_sms');
var get_info_account_sms = require('./routes/get_info_account_sms');
var get_all_person = require('./routes/get_all_person');
var get_evaluate_report =  require('./routes/get_evaluate_report');
var get_all_items_rest = require('./routes/get_all_items_rest');
var set_edit_item_rest = require('./routes/set_edit_item_rest');
var set_new_item_rest = require('./routes/set_new_item_rest');
var set_delete_item_rest = require('./routes/set_delete_item_rest');
var set_activate_item_rest = require('./routes/set_activate_item_rest');
var set_edit_user_rest = require('./routes/set_edit_user_rest');
var set_new_user_rest = require('./routes/set_new_user_rest');
var get_all_user_rest = require('./routes/get_all_user_rest');
var get_is_has_evaluation = require('./routes/get_is_has_evaluation');
var get_type_message = require('./routes/get_type_message');
var send_to_person_message = require('./routes/send_to_person_message');
var send_to_admin_message = require('./routes/send_to_admin_message');
var seen_message = require('./routes/seen_message');
var get_all_message_from_admin = require('./routes/get_all_message_from_admin');
var get_all_message_from_admin_web = require('./routes/get_all_message_from_admin_web');
var get_factor_detail = require('./routes/get_factor_detailes');
var get_factor_detailes_web = require('./routes/get_factor_detailes_web');
var get_count_message = require('./routes/get_count_message');
var set_factor_rest = require('./routes/set_factor_rest');
var get_report_rest = require('./routes/get_report_rest');
var get_detail_factor = require('./routes/get_detail_factor');
var set_new_guest = require('./routes/set_new_guest');
var send_activation_code_sms = require('./routes/send_activation_code_sms');
var get_credit_amount_info = require('./routes/get_credit_amount_info');
var mng_login = require('./routes/mng_login');
var mng_get_all_report_status = require('./routes/mng_get_all_report_status');
var get_organization_unit = require('./routes/get_organization_unit');
var mng_get_pool_reception_day = require('./routes/mng_get_pool_reception_day');
var mng_get_pool_reception_limit = require('./routes/mng_get_pool_reception_limit');
var mng_get_pool_reception_status = require('./routes/mng_get_pool_reception_status');
var mng_get_creditor_amounts_limit = require('./routes/mng_get_creditor_amounts_limit');
var mng_get_debtor_amounts_limit = require('./routes/mng_get_debtor_amounts_limit');
var mng_get_creditor_amounts_today = require('./routes/mng_get_creditor_amounts_today');
var mng_get_debtor_amounts_today = require('./routes/mng_get_debtor_amounts_today');
var mng_get_sum_price_receipt = require('./routes/mng_get_sum_price_receipt');
var mng_get_sum_price_creditor = require('./routes/mng_get_sum_price_creditor');
var mng_get_sum_price_creditor_today = require('./routes/mng_get_sum_price_creditor_today');
var get_all_salable_services = require('./routes/get_all_salable_services');
var get_all_reservable_services = require( './routes/get_all_reservable_services');
var set_reserve_request = require('./routes/set_reserve_request');
var set_package_registration = require('./routes/set_package_registration');
var get_formula_fraction_of_charge =  require('./routes/get_formula_fraction_of_charge');
                                                       

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


app.use('/', index);
app.use('/sign_out', sign_out);
app.use('/sign_up', sign_up);
app.use('/sign_out_rest', sign_out_rest);
app.use('/check_activation_code', check_activation_code);
app.use('/check_activation_code_rest', check_activation_code_rest);
app.use('/check_activation_code_with_image', check_activation_code_with_image);
app.use('/set_password', set_password);
app.use('/set_password_rest', set_password_rest);
app.use('/login', login);
app.use('/login_varzeshsoft', login_varzeshsoft);
app.use('/login_rest', login_rest);
app.use('/get_cities_list', get_cities_list);
app.use('/get_all_services', get_all_services);
app.use('/get_main_service_detailes', get_main_service_detailes);
app.use('/get_main_service_detailes_service', get_main_service_detailes_service);
app.use('/get_sub_service_detailes', get_sub_service_detailes);
app.use('/get_sub_service_detailes_service', get_sub_service_detailes_service);
app.use('/get_credit_service_detailes', get_credit_service_detailes);
app.use('/get_credit_service_detailes_service', get_credit_service_detailes_service);
app.use('/get_factor', get_factor);
app.use('/get_factor_detailes', get_factor_detailes);
app.use('/get_factor_detailes_web', get_factor_detailes_web);
app.use('/get_transaction', get_transaction);
app.use('/get_transaction_web', get_transaction_web);
app.use('/send_evaluate_notify', send_evaluate_notify);
app.use('/set_evaluate_rate', set_evaluate_rate);
app.use('/set_token', set_token);
app.use('/set_token_with_device_type', set_token_with_device_type);
app.use('/set_image_user', set_image_user);
app.use('/send_message_with_sms', send_message_with_sms);
app.use('/send_message_with_notification', send_message_with_notification);
app.use('/send_message_to_all_with_notification', send_message_to_all_with_notification);
app.use('/get_info_account_sms', get_info_account_sms);
app.use('/get_all_person', get_all_person);
app.use('/get_evaluate_report', get_evaluate_report);
app.use('/get_all_items_rest', get_all_items_rest);
app.use('/set_edit_item_rest', set_edit_item_rest);
app.use('/set_new_item_rest', set_new_item_rest);
app.use('/set_delete_item_rest', set_delete_item_rest);
app.use('/set_activate_item_rest', set_activate_item_rest);
app.use('/set_edit_user_rest', set_edit_user_rest);
app.use('/set_new_user_rest', set_new_user_rest);
app.use('/get_all_user_rest', get_all_user_rest);
app.use('/get_type_message', get_type_message);
app.use('/send_to_person_message', send_to_person_message);
app.use('/send_to_admin_message', send_to_admin_message);
app.use('/seen_message', seen_message);
app.use('/get_all_message_from_admin', get_all_message_from_admin);
app.use('/get_all_message_from_admin_web', get_all_message_from_admin_web);
app.use('/get_factor_detail', get_factor_detail);
app.use('/get_count_message', get_count_message);
app.use('/set_factor_rest', set_factor_rest);
app.use('/get_report_rest', get_report_rest);
app.use('/get_detail_factor', get_detail_factor);
app.use('/get_last_version', get_last_version);
app.use('/set_new_guest', set_new_guest);
app.use('/send_activation_code_sms', send_activation_code_sms);
app.use('/send_verify_sms', send_verify_sms);
app.use('/get_credit_amount_info', get_credit_amount_info);
app.use('/get_is_has_evaluation', get_is_has_evaluation);
app.use('/mng_login', mng_login);
app.use('/mng_get_all_report_status', mng_get_all_report_status);
app.use('/get_organization_unit', get_organization_unit);
app.use('/mng_get_pool_reception_day', mng_get_pool_reception_day);
app.use('/mng_get_pool_reception_limit', mng_get_pool_reception_limit);
app.use('/mng_get_pool_reception_status', mng_get_pool_reception_status);
app.use('/mng_get_creditor_amounts_limit', mng_get_creditor_amounts_limit);
app.use('/mng_get_debtor_amounts_limit', mng_get_debtor_amounts_limit);
app.use('/mng_get_creditor_amounts_today', mng_get_creditor_amounts_today);
app.use('/mng_get_debtor_amounts_today', mng_get_debtor_amounts_today);
app.use('/mng_get_sum_price_creditor', mng_get_sum_price_creditor);
app.use('/mng_get_sum_price_creditor_today', mng_get_sum_price_creditor_today);
app.use('/mng_get_sum_price_receipt', mng_get_sum_price_receipt);
app.use('/get_all_salable_services', get_all_salable_services);
app.use('/get_all_reservable_services', get_all_reservable_services);
app.use('/set_reserve_request', set_reserve_request);
app.use('/set_package_registration', set_package_registration);
app.use('/get_formula_fraction_of_charge', get_formula_fraction_of_charge);
                                           



// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;