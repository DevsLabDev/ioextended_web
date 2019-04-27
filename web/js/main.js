$(window).load(function () {
	var config = {
		apiKey: "AIzaSyB0YAlxdk-EewWTpggzfFDu8zi3rupTpRU",
		authDomain: "ioextendedgt18.firebaseapp.com",
		databaseURL: "https://ioextendedgt18.firebaseio.com",
		projectId: "ioextendedgt18",
		storageBucket: "ioextendedgt18.appspot.com",
		messagingSenderId: "685656696459"
	};
	firebase.initializeApp(config);

});

// REGISTER FORM FUNCTIO
function registro(nodo) {
	var dato = {};
	var validInteres = false;
	var validDias = false;
	if (nodo === "registro") {
		dato = {
			nombre: document.getElementById("nombre").value, correo: document.getElementById("email").value,
			telefono: document.getElementById("telefono").value, ocupacion: document.getElementById("ocupacion").value
		};
		if (!dato['nombre'] || !dato['correo'] || !dato['telefono'] || !dato['ocupacion']) {
			swal("Hubo un problema", "Todos los campos son obligatorios", "warning");
			return;
		}
		console.log(dato);
	} else if (nodo === "message") {
		validDias = true;
		validInteres = true;
		dato = {
			nombre: document.getElementById("message_nombre").value, correo: document.getElementById("message_correo").value,
			tema: document.getElementById("message_tema").value, mensaje: document.getElementById("message_mensaje").value
		}
	}
	firebase.database().ref('2019/' + nodo).push(dato).then(function (value) {
		if (nodo == "registro") {
			swal("¡Registrado!", "Te has registrado con el correo " + document.getElementById("email").value, "success");
			document.getElementById("nombre").value = null;
			document.getElementById("email").value = null;
			document.getElementById("telefono").value = null;
			document.getElementById("ocupacion").value = null;
		} else {
			swal("¡Enviado!", "Te responderemos al correo" + document.getElementById("message_correo").value, "success");
			document.getElementById("message_nombre").value = null;
			document.getElementById("message_correo").value = null;
			document.getElementById("message_tema").value = null;
			document.getElementById("message_mensaje").value = null;
		}
	}).catch(function (error) { console.log(error) });
}