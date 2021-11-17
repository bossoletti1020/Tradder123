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

        { path: '/iniciado/', url: 'iniciado.html', }

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

$$(document).on('page:init', '.page[data-name="iniciado"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);

    $$('#bRegistro').css("display", "none");
    $$('#bLogin').css("display", "none");
    $$('#registrado').css("display", "block");
    $$('#bPublicar').css("display", "block");
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

var imgNombre, imgUrl;
$$(document).on('page:init', '.page[data-name="publicar"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized

    var files = [];
    var reader = new FileReader();

    $$('#pSeleccionar').on('click', function (e) {
        var input = document.createElement('input');
        input.type = 'file';


        input.onchange = e => {
            files = e.target.files;
            reader = new FileReader();
            reader.onload = function () {
                $$("#myImg").attr('src', this.result);
            }
            reader.readAsDataURL(files[0]);
        }
        input.click();
    })

    $$('#pSubir').on('click', function () {
        imgNombre = $$('#pNombre').val();
        var uploadTask = firebase.storage().ref('Imagen/' + imgNombre + ".png").put(files[0]).then(() =>  uploadTask.snapshot.ref.getDownloadURL().then(function (url) {
            imgUrl = url;
        }));


        uploadTask.on('stage_changed', function (snapshot) {
            var progress = (snapshot.bytesTranferred / snapshot.totalBytes) * 100;

            $$('#upProgress').html('Upload' + progress + '%');
        },

            function (error) {
                alert('error in saving the image');
            },

            function () {
               

                console.log(imgUrl);

                datos2 = {
                    Nombre: imgNombre,
                    URL: imgUrl
                }

                colProducto.doc('Pictures/' + imgNombre).set(datos2)
                .then(() => {
                    console.log("Document successfully written!");
                })
                .catch((error) => {
                    console.error("Error writing document: ", error);
                });

                alert('image added successfully');
            }
        );





    })


    // matemateo();
    // matemateo2();

})






// nombreImagen = $$('#lEmail').val();


// function matemateo() {
//     $$('#pImagen').on('change', function () {
//         var storageRef = firebase.storage().ref();
//         var imageRef = storageRef.child('mateoImagen');
//         var file = this.files[0];

//         imageRef.put(file).then(function (snapshot) {
//             console.log('Uploaded a blob or file!');
//         })
//     });

//     $$('#pPublicar').on('click', function() {
//         var storageRef = firebase.storage().ref();
//         var imageRef = storageRef.child('mateoImagen');

//         imageRef.getDownloadURL().then(function(url) {
//             // `url` is the download URL for 'images/stars.jpg'

//             // This can be downloaded directly:
//             var xhr = new XMLHttpRequest();
//             xhr.responseType = 'blob';
//             xhr.onload = function(event) {
//               var blob = xhr.response;
//             };
//             xhr.open('GET', url);
//             xhr.send();

//             // Or inserted into an <img> element:
//             // var img = document.getElementById('myimg');
//             // img.src = url;
//             console.log(url);
//           }).catch(function(error) {
//             // Handle any errors
//           });
//     })

// }

// function matemateo2() {

// }



var emailDelUser = "";

var db = firebase.firestore();
var colUsuario = db.collection("Usuarios");
var colProducto = db.collection("Producto");


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
                        mainView.router.navigate('/iniciado/');

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


