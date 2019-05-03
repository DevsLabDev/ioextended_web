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
var adentro = 0;
firebase.auth().signInAnonymously().catch(function (error) { console.log(error) });
function ingreso(key) {
    firebase.database().ref('2019/registro/' + key).once("value").then((snapshot) => {
        var val = snapshot.val();
        if (!val.llego) {
            val.llego = true;
        }
        val.llego08 = true;
        val.llegada08 = new Date().getTime();
        firebase.database().ref('2019/registro/' + key).set(val);
    });
}
function get() {
    var registro = firebase.database().ref('2019/registro');
    registro.once('value', (snapshot) => {
        var data = document.getElementById("data");
        snapshot.forEach(snap => {
            var val = snap.val();
            var key = snap.key;
            var accion = "<td class='action'><button onClick='ingreso(" + '"' + key + '"' + ")' class='btn btn-success' >Ingreso</button></td>";
            if (val.llego08) {
                adentro = adentro + 1;
                accion = "<td>Ya ingreso</td>";
                $('#numero').html(adentro);
            }
            $('#data').append("<tr id=" + key + ">" +
                "<td>" + val.nombre + "</td>" +
                "<td>" + val.correo + "</td>" +
                "<td>" + val.telefono + "</td>" +
                "<td>" + val.ocupacion + "</td>" +
                accion +
                "</tr>");
        });
        $('#datos').DataTable();
        listen();
    });
}
function listen() {
    var registro = firebase.database().ref('2019/registro');
    registro.on('child_changed', (snap) => {
        var val = snap.val();
        console.log(snap.key);
        var exist = document.getElementById(snap.key);
        var accion = "<td class='action'><button onClick='ingreso(" + '"' + snap.key + '"' + ")' class='btn btn-success' >Ingreso</button></td>";
        if (val.llego08) {
            console.log('changed');
            adentro = adentro + 1;
            $('#numero').html(adentro);
            accion = "<td>Ya ingreso</td>";
        }
        $("#data #" + snap.key).html("<td>" + val.nombre + "</td>" +
            "<td>" + val.correo + "</td>" +
            "<td>" + val.telefono + "</td>" +
            "<td>" + val.ocupacion + "</td>" +
            accion);
    });
}
$(document).ready(function () {
    get();
});