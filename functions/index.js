const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
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
exports.sendWelcomeEmail = functions.database.ref('registro/{assistant}').onCreate((snap, context) => {
	var registro = snap.val();
  return sendWelcomeEmail(registro.correo, registro.nombre);
});

exports.generateCsv = functions.https.onRequest((req, res) => {
  admin.database().ref('registro').once('value').then((snapshot) => {
    var csv = '';
    var jsontmp = [];
    var json = {};
    snapshot.forEach((child)=>{
      json = child.toJSON();
      jsontmp.push({
        nombre: json.nombre, correo: json.correo, telefono: json.telefono, tipo: json.tipo, 
        8: json.dias.d8, 9: json.dias.d9, 10: json.dias.d10,  
        desarrollo: json.intereses.desarrollo, educacion: json.intereses.educacion, gapps: json.intereses.gapps, 
        marketing: json.intereses.marketing, nuevos: json.intereses.nuevos
      });
      csv = JSON.stringify(jsontmp);
    });
    return res.send(csv);
  }).catch((ex) => {
    console.log(ex);
    return null;
  });
});

exports.sendProblemEmail = functions.https.onRequest((req, res) => {
  admin.database().ref('registro').once('value').then((snapshot) => {
    snapshot.forEach((child)=>{
      if (!child.val()['intereses']) {
        console.log(child.val()['correo'], child.val());
        const mailOptions = {
          from: `${APP_NAME} <info@devslabgt.com>`,
          to: child.val()['correo'],
          subject: 'Hemos realizado un cambio y necesitamos tu apoyo',
          text: 'Hola ' + child.val()['nombre'] + ' Hemos realizado un cambio en los datos de registro y necesitamos que vuelvas a realizarlo.' 
          + 'De está manera estaremos en contacto y podremos hacerte saber toda la información del evento. '
          + 'Para registrarte ingresa a https://ioextendedgt.tecnoagenda.com .'
        };
        mailTransport.sendMail(mailOptions).then(() => {
            console.log('Nuevo correro de problem enviado a:', child.val()['correo']);
            admin.database().ref('registro/' + child.key).remove();
            return null;
        }).catch((ex)=>{
          console.log(ex);
        });
      }
    });
    return null;
  }).catch((ex)=>{
    console.log(ex);
    return null;
  });
   return res;
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