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
exports.sendWelcomeEmail = functions.database.ref('2019/registro/{assistant}').onCreate((snap, context) => {
  var registro = snap.val();
  return sendWelcomeEmail(registro.correo, registro.nombre);
});

exports.sendWelcomeEmail = functions.database.ref('2019/message/{assistant}').onCreate((snap, context) => {
  var registro = snap.val();
  return sendQuestion(registro.correo, registro.nombre, registro.tema, registro.mensaje);
});

exports.generateCsv = functions.https.onRequest((req, res) => {
  admin.database().ref('2019/registro').once('value').then((snapshot) => {
    var csv = '';
    var jsontmp = [];
    var json = {};
    var emails = {};
    snapshot.forEach((child) => {
      json = child.toJSON();
      if (!emails[json.correo] || emails[json.correo] === undefined || emails[json.correo] === null) {
        emails[json.correo] = { email: json.correo };
      }
      if (json.llegada) {
        var llegada = new Date(json.llegada * 1000);
      }
      if (json.llegada9) {
        var llegada_9 = new Date(json.llegada9 * 1000);
      }
      if (json.llegada10) {
        var llegada_10 = new Date(json.llegada10 * 1000);
      }
      jsontmp.push({
        nombre: json.nombre, correo: json.correo, telefono: json.telefono, tipo: json.tipo,
        8: json.dias.d8, 9: json.dias.d9, 10: json.dias.d10,
        desarrollo: json.intereses.desarrollo, educacion: json.intereses.educacion, gapps: json.intereses.gapps,
        marketing: json.intereses.marketing, nuevos: json.intereses.nuevos, llego: json.llego, llegada_8: String(llegada ? llegada.getHours() + ":" + llegada.getMinutes() : llegada),
        llegada_9: String(llegada_9 ? llegada_9.getHours() + ":" + llegada_9.getMinutes() : llegada_9), llegada_10: String(llegada_10 ? llegada_10.getHours() + ":" + llegada_10.getMinutes() : llegada_10), registrados: Object.keys(emails).length
      });
      csv = JSON.stringify(jsontmp);
    });
    return res.send(csv);
  }).catch((ex) => {
    console.log(ex);
    return null;
  });
});

exports.sendEventWelcomMail = functions.database.ref('2019/registro/{assistant}').onUpdate((snap, context) => {
  var registro = snap.after.val();
  if (registro.llego) {
    return sendWelcomEventMail(registro.correo, registro.nombre);
  }
  return null;
});

exports.sendProblemEmail = functions.https.onRequest((req, res) => {
  admin.database().ref('registro').once('value').then((snapshot) => {
    snapshot.forEach((child) => {
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
        }).catch((ex) => {
          console.log(ex);
        });
      }
    });
    return null;
  }).catch((ex) => {
    console.log(ex);
    return null;
  });
  return res;
});

// [END sendRegisterEmail]
function sendWelcomeEmail(email, displayName) {
  const mailOptions = {
    from: `I/O Extended Guatemala 2019 <noreply@devslabgt.com>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `¡Bienvenido al I/O Extended Guatemala 2019!`;
  mailOptions.text = `¡Hola ${displayName || ''}! Bienvenido al I/O Extended Guatemala 2019. Esperamos verte todos los días del evento.`;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Nuevo correro de registro enviado a:', email);
  });
}

function sendQuestion(email, displayName, tema, mensaje) {
  const mailOptions = {
    from: `I/O Extended Guatemala 2019 <noreply@devslabgt.com>`,
    replyTo: `${displayName}, <${email}>`,
    to: 'info@devslabgt.com',
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = tema;
  mailOptions.text = mensaje;
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Nuevo correro de registro enviado a:', email);
  });
}

function sendWelcomEventMail(email, displayName) {
  const mailOptions = {
    from: `I/O Extended Guatemala 2019 <noreply@devslabgt.com>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `¡Bienvenido al  I/O Extended Guatemala 2019!`;
  mailOptions.text = '¡Hola ' + displayName + '! Que alegre es verte llegar a este mega evento de Google en Guatemala. Esperamos que lo disfrutes mucho. '
    + 'Si aún no sabes que temas ver puedes pasarte por el sitio web del evento y revisar el programa. https://ioextendedgt.tecnoagenda.com';
  return mailTransport.sendMail(mailOptions).then(() => {
    return console.log('Correo de llegada enviado a:', email);
  });
}