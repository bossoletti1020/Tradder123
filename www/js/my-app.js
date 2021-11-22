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

        { path: '/publicar/', url: 'publicar.html', },

        { path: '/producto/', url: 'producto.html', }

    ]
    // ... other parameters
});

var mainView = app.views.create('.view-main');

var db = firebase.firestore();
var colUsuario = db.collection("Usuarios");
var colProducto = db.collection("Producto");

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
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/firebase.User
            var uid = user.uid;
            console.log(uid);

            $$('#bRegistro').css("display", "none");
            $$('#bLogin').css("display", "none");
            $$('#bPublicar').css("display", "block");
            $$('#cerrarSesion').on('click', signOut)
            $$('#cerrarSesion').css("display", "block");

            const usuario = firebase.auth().currentUser;




            colProducto.where("rol", "==", "producto")
                .get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());

                        colUsuario.where('id', '==', uid).get().then((querySnapshot) => {




                            $$(".pedropicapiedra").append(
                                '<div class="carta card demo-card-header-pic">' +
                                '<div class="block block-strong">' +
                                '<img src="' + doc.data().photoURL + '" height="300" class="imgProducto lazy lazy-fade-in demo-lazy" style="; width: 100%;" />' +
                                '<p class="contenidoProduct">' +
                                doc.data().Nombre +
                                '</p>' + '<hr>' + 
                                '<div class="card-content card-content-padding">' +
                                '<p class="contenidoProduct date">' + "Dirección: " +
                                doc.data().Direccion +
                                '</p>' +
                                '<p class="contenidoProduct">' + "Descripción: " +
                                doc.data().Descripcion +
                                '</p>' + '<hr>' +
                                '</div>' +
                                '<div>' +
                                '<div class="block">' +
                                '<div class="row">' +
                                '<button id="pSubir" class="btn-subir button button-fill button-round">' +
                                'Contactar' +
                                '</button>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '</div >');
                        });
                    });
                })

        } else {
            colProducto.where("rol", "==", "producto")
                .get().then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        console.log(doc.id, " => ", doc.data());

                        // colUsuario.where('id', '==', uid).get().then((querySnapshot) => {




                        $$(".pedropicapiedra").append(
                            '<div class="card demo-card-header-pic">' +
                            '<div class="block block-strong">' +
                            '<img src="' + doc.data().photoURL + '" class="imgProducto lazy lazy-fade-in demo-lazy" style="width: 100%;" />' +
                            '<p class="contenidoProduct">' +
                            doc.data().Nombre + 
                            '</p>' + '<hr>' +
                            '<div class="card-content card-content-padding">' +
                            '<p class="contenidoProduct date">' + "Descripción: "+
                            doc.data().Descripcion +
                            '</p>' +
                            '<p class="contenidoProduct">' + "Dirección: " +
                            doc.data().Direccion +
                            '</p>' + '<hr>' +
                            '</div>' +
                            '</div>' +
                            '</div >');
                    });
                })
        }
    });


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

var imgUrl;
$$(document).on('page:init', '.page[data-name="publicar"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized


    var imgNombre = "";
    var files = [];
    var reader = new FileReader();

    $$('#pSeleccionar').on('click', function (e) {
        var input = document.createElement('input');
        input.type = 'file';


        input.onchange = e => {
            files = e.target.files;
            reader = new FileReader();
            reader.onload = function () {
                $$("#pSeleccionar").attr('src', this.result);
            }
            reader.readAsDataURL(files[0]);
        }
        input.click();
    })

    $$('#pSubir').on('click', function () {

        imgNombre = $$('#pNombre').val();
        imgDescripcion = $$('#pDescripcion').val();
        imgDireccion = $$('#pDireccion').val()

        var imagesRef = firebase.storage().ref('Imagen/' + imgNombre + ".png");

        imagesRef.put(files[0]).then(function (snapshot) {
            console.log('Uploaded a blob or file!');

            imagesRef.getDownloadURL().then(function (url) {
                imgUrl = url;
                console.log(imgUrl);
                console.log(imgNombre);
                mainView.router.navigate('/index/');

                var id = firebase.auth().currentUser.uid;
                claveColeccion = imgNombre;

                console.log(id);

                datamateo = {
                    id: id,
                    Nombre: imgNombre,
                    photoURL: imgUrl,
                    Direccion: imgDireccion,
                    Descripcion: imgDescripcion,
                    rol: "producto"
                }

                colProducto.doc(claveColeccion).set(datamateo)
                    .then(() => {
                        console.log("Document successfully written!");
                    })
                    .catch((error) => {
                        console.error("Error writing document: ", error);
                    });
            });
        });

    });
})

var emailDelUser = "";

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
                        mainView.router.navigate('/index/');

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

//Cerrar sesion

function signOut() {
    firebase.auth().signOut()
        .then(() => {
            mainView.router.refreshPage();
        }).catch((error) => {
            // An error happened.
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


