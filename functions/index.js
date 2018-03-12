const functions = require('firebase-functions');
const admi = require('firebase-admin');
const nodemailer = require('nodemailer');
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'devslabgt@gmail.com',
    pass: 'devslab1234',
  },
});
const APP_NAME = 'I/O Extended Guatemala 2018';
// [START sendRegisterEmail]
exports.sendWelcomeEmail = functions.database.ref('registro/{assistant}').onCreate((event) => {
	var registro = event.data.val();
  return sendWelcomeEmail(registro.correo, registro.nombre);
});
// [END sendRegisterEmail]
function sendWelcomeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@devslabgt.com>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `¡Bienvenido al  ${APP_NAME}!`;
  mailOptions.text = `¡Hola ${displayName || ''}! Bienvenido al ${APP_NAME}. Esperamos verte todos los días del evento.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Nuevo correro de registro enviado a:', email);
  });
}