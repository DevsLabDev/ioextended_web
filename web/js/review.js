// Initialize Firebase
var config = {
    apiKey: "AIzaSyB0YAlxdk-EewWTpggzfFDu8zi3rupTpRU",
    authDomain: "ioextendedgt18.firebaseapp.com",
    databaseURL: "https://ioextendedgt18.firebaseio.com",
    projectId: "ioextendedgt18",
    storageBucket: "ioextendedgt18.appspot.com",
    messagingSenderId: "685656696459"
};
firebase.initializeApp(config);
firebase.auth().signInAnonymously().catch(function (error) { console.log(error) });
function ingreso(key) {
    firebase.database().ref('registro/' + key).once("value").then((snapshot) => {
        var val = snapshot.val();
        val.llego = true;
        val.llegada = new Date().getTime();
        firebase.database().ref('registro/' + key).set(val);
    });
}
function get() {
    var registro = firebase.database().ref('registro');
    registro.once('value', (snapshot) => {
        var data = document.getElementById("data");
        snapshot.forEach(snap => {
            var val = snap.val();
            var key = snap.key;
            var accion = "<td class='action'><button onClick='ingreso(" + '"' + key + '"' + ")' class='btn btn-success' >Ingreso</button></td>";
            if (val.llego) {
                accion = "<td>Ya ingreso</td>";
            }
            $('#data').append("<tr id=" + key + ">" +
                "<td>" + val.nombre + "</td>" +
                "<td>" + val.correo + "</td>" +
                "<td>" + val.telefono + "</td>" +
                "<td>" + val.tipo + "</td>" +
                accion +
                "</tr>");
        });
        $('#datos').DataTable();
        listen();
    });
}
function listen() {
    var registro = firebase.database().ref('registro');
    registro.on('child_added', (snap) => {
        var exist = document.getElementById(snap.key);
        console.log(exist);
        if (!exist || exist == null) {
            var val = snap.val();
            var accion = "<td class='action'><button onClick='ingreso(" + '"' + snap.key + '"' + ")' class='btn btn-success' >Ingreso</button></td>";
            if (val.llego) {
                accion = "<td>Ya ingreso</td>";
            }
            $("#data #" + snap.key).html("<td>" + val.nombre + "</td>" +
                "<td>" + val.correo + "</td>" +
                "<td>" + val.telefono + "</td>" +
                "<td>" + val.tipo + "</td>" +
                accion);
        }
    });
    registro.on('child_changed', (snap) => {
        var val = snap.val();
        var accion = "<td class='action'><button onClick='ingreso(" + '"' + snap.key + '"' + ")' class='btn btn-success' >Ingreso</button></td>";
        if (val.llego) {
            accion = "<td>Ya ingreso</td>";
        }
        $("#data #" + snap.key).html("<td>" + val.nombre + "</td>" +
            "<td>" + val.correo + "</td>" +
            "<td>" + val.telefono + "</td>" +
            "<td>" + val.tipo + "</td>" +
            accion);
    });
}
$(document).ready(function () {
    get();
});