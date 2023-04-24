"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidEmail = exports.sendMail = void 0;

var _config = _interopRequireDefault(require("../../../config"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _googleapis = require("googleapis");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var CLIENT_ID = _config["default"].CLIENT_ID,
    CLIENT_SECRET = _config["default"].CLIENT_SECRET,
    REDIRECT_URI = _config["default"].REDIRECT_URI,
    REFRESH_TOKEN = _config["default"].REFRESH_TOKEN,
    MY_EMAIL = _config["default"].MY_EMAIL;
var oAuth2Client = new _googleapis.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN
});

var sendMail = function sendMail(receiver, mail) {
  var accessToken, transport, mailOptions, result;
  return regeneratorRuntime.async(function sendMail$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(oAuth2Client.getAccessToken());

        case 3:
          accessToken = _context.sent;
          transport = _nodemailer["default"].createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: MY_EMAIL,
              clientId: CLIENT_ID,
              clientSecret: CLIENT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: accessToken
            }
          });
          mailOptions = {
            from: 'Hê hê',
            to: receiver,
            subject: mail.subject,
            text: mail.text,
            html: mail.html
          };
          console.log("Sending email to ".concat(receiver, "..."));
          _context.next = 9;
          return regeneratorRuntime.awrap(transport.sendMail(mailOptions));

        case 9:
          result = _context.sent;
          if (result.accepted != null) console.info("\x1B[32mSent to ".concat(result.accepted[0]));else console.error("\x1B[31mFailed to send email to ".concat(result.accepted[0]));
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

exports.sendMail = sendMail;

var isValidEmail = function isValidEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

exports.isValidEmail = isValidEmail;