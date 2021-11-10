// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },
    // Add default routes
    routes: [

        { path: '/Tradder/', url: 'tradder.html', },

        { path: '/index/', url: 'index.html', },

        { path: '/registro/', url: 'registrar.html', },

        { path: '/inicio/', url: 'iniciar.html', },

    ]
    // ... other parameters
});

var mainView = app.views.create('.view-main');

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {
    console.log("Device is ready!");
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
    // Do something here when page loaded and initialized
    console.log(e);
})

$$(document).on('page:init', '.page[data-name="index"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);

})

$$(document).on('page:init', '.page[data-name="registro"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);

    $$('#rRegistro').on('click', fnRegistro);

})

$$(document).on('page:init', '.page[data-name="inicio"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);

    $$('#lLogin').on('click', fnLogin);

})

var emailDelUser = "";

var db = firebase.firestore();
var colUsuario = db.collection("Usuarios");

//Logueo

function fnLogin() {

    emailDelUser = $$('#lEmail').val();
    passDelUser = $$('#lPass').val();

    firebase.auth().signInWithEmailAndPassword(emailDelUser, passDelUser)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;

            console.log("Bienvenid@!!! " + emailDelUser);

            claveDeColeccion = emailDelUser;

            var docRef = colUsuario.doc(claveDeColeccion);

            docRef.get().then((doc) => {
                if (doc.exists) {
                    console.log("Document data:", doc.data());

                    console.log(doc.id);
                    console.log(doc.data().nombre);
                    console.log(doc.data().rol);

                    if (doc.data().rol == "admin") {
                        mainView.router.navigate('/panelAdmin/');
                    } else {
                        mainView.router.navigate('/Tradder/');
                    }


                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });


            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.error(errorCode);
            console.error(errorMessage);
        });




}

//Registro

function fnRegistro() {


    // cada un@ pone su magia para recuperar el mail y la clave de un form...
    emailDelUser = $$('#rEmail').val();
    passDelUser = $$('#rPass').val();


    firebase.auth().createUserWithEmailAndPassword(emailDelUser, passDelUser)
        .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log("Bienvenid@!!! " + emailDelUser);
            console.log(passDelUser);
            // ...
            mainView.router.navigate('/inicio/');


            claveDeColeccion = emailDelUser;

            nombre = $$('#rNombre').val();
            apellido = $$('#rApellido').val();
            dni = $$('#rDNI').val();
            fecha = $$('#rFecha').val();
            genero = $$('#rGenero').val();

            datos = {
                nombre: nombre,
                apellido: apellido,
                dni: dni,
                fecha: fecha,
                genero: genero,
                rol: "usuario"
            }




            colUsuario.doc(claveDeColeccion).set(datos)
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });


        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;

            console.error(errorCode);
            console.error(errorMessage);

            if (errorCode == "auth/email-already-in-use") {
                console.error("el mail ya esta usado");
            }

            // ..
        });



}


