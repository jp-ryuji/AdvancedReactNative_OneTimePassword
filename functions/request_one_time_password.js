const admin = require('firebase-admin');
const twilio = require('./twilio');

module.exports = function(req, res) {
  if (!req.body.phone) {
    return res.status(422).send({ error: 'You must provide a phone number' });
  }

  const phone = String(req.body.phone).replace(/[^\d]/g, '');

  admin.auth().getUser(phone)
    .then(userRecord => {
      const code = Math.floor((Math.random() * 8999 + 1000));

      twilio.messages.create({
        body: 'Your code is ' + code,
        to: phone,
        from: '+18053167032'
      }, (err) => {
        if (err) { return res.status(422).send(err); }

        // NOTE: Firebase authentication only has email, password, created_at and disabled.
        //   Arbitrary data can't be saved.
        //   So database needs to be used for such arbitrary data.
        admin.database().ref('users/' + phone)
          .update({ code: code, codeValid: true }, () => {
            res.send({ success: true });
          });
      })
    })
    .catch((err) => {
      // NOTE: Recommendation on production. (Don't show actual error to the user)
      //res.status(422).send({ error: err });
      res.status(422).send({ error: err });
    });
}
