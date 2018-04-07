const twilio = require('twilio');

const accountSid = 'AC54dffd742d5e7a6a60dfc94a6767884e';
const authToken = '7648cffcbaa77ad1e30943851c332736';

module.exports = new twilio.Twilio(acountSid, authToken);


