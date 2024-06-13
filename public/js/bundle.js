/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n    // Paso 1: Abrir una conexión a IndexedDB\r\n    const request = indexedDB.open('miBaseDeDatos', 1);\r\n\r\n    // Paso 2: Crear el almacén de objetos si no existe\r\n    request.onupgradeneeded = function(event) {\r\n    const db = event.target.result;\r\n    \r\n    // Crear un almacén de objetos con 'id' como clave primaria\r\n    if (!db.objectStoreNames.contains('usuarios')) {\r\n        const objectStore = db.createObjectStore('usuarios', { keyPath: 'id' });\r\n        // Crear un índice para buscar usuarios por grupo, si es necesario\r\n        objectStore.createIndex('porGrupo', 'grupo', { unique: false });\r\n    }\r\n    };\r\n\r\n    request.onsuccess = function(event) {\r\n    console.log('Base de datos abierta exitosamente');\r\n    obtenerDatosDeUsuarios();\r\n    };\r\n\r\n    request.onerror = function(event) {\r\n    console.error('Error al abrir la base de datos:', event.target.errorCode);\r\n    };\r\n\r\n    const inputNombre = document.getElementById(\"nombre\");\r\n    const inputApellido = document.getElementById(\"apellido\");\r\n    const inputGrupo = document.getElementById(\"grupo\");\r\n    const formulario = document.getElementById(\"formulario\");\r\n    const botonSubmit = document.getElementById(\"submit\");\r\n    const userIdInput = document.getElementById(\"usuarioId\");\r\n    const contenedorGrupos = document.querySelector(\".grupos-section\");\r\n\r\n    function unirseAGrupo(idUsuario, nombre, apellido, grupo) {\r\n        return new Promise((resolve, reject) => {\r\n            const request = indexedDB.open('miBaseDeDatos', 1);\r\n    \r\n            request.onsuccess = function(event) {\r\n                const db = event.target.result;\r\n                const transaction = db.transaction(['usuarios'], 'readwrite');\r\n                const store = transaction.objectStore('usuarios');\r\n                const usuario = { id: idUsuario, nombre: nombre, apellido: apellido, grupo: grupo };\r\n                const addRequest = store.add(usuario);\r\n    \r\n                addRequest.onsuccess = function() {\r\n                    console.log('Usuario insertado exitosamente en el grupo:', grupo);\r\n                    resolve();\r\n                };\r\n    \r\n                addRequest.onerror = function(event) {\r\n                    console.error('Error al insertar el usuario:', event.target.error);\r\n                    reject(event.target.error);\r\n                };\r\n            };\r\n    \r\n            request.onerror = function(event) {\r\n                console.error('Error al abrir la base de datos:', event.target.errorCode);\r\n                reject(event.target.errorCode);\r\n            };\r\n        });\r\n    }\r\n\r\n      const insertarAlerta = (tipo, mensaje) => {\r\n        const alerta = document.createElement(\"div\");\r\n    \r\n        // Corrige el texto en el caso de éxito para que muestre \"Éxito\" en lugar de \"Error\"\r\n        if (tipo === \"error\") {\r\n            alerta.innerHTML = `\r\n                <div class=\"bg-orange-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md alert\" role=\"alert\">\r\n                <p><b>Error! </b>${mensaje}</p>\r\n                </div>\r\n            `;\r\n        } else if (tipo === \"exito\") {\r\n            alerta.innerHTML = `\r\n                <div class=\"bg-orange-100 border-l-4 border-green-500 text-green-700 p-4 alert\" role=\"alert\">\r\n                <p><b>Exito! </b>${mensaje}</p>\r\n                </div>\r\n            `;\r\n        }\r\n    \r\n        formulario.insertBefore(alerta, formulario.firstChild);\r\n        // setTimeout(() => alerta.remove(), 5000);\r\n    \r\n        return false;\r\n    };\r\n    \r\n    const limpiarAlertas = () => {\r\n        const alertas = document.querySelectorAll(\".alert\");\r\n        alertas.forEach(alerta => alerta.remove());\r\n    }\r\n    \r\n    document.addEventListener(\"DOMContentLoaded\", () => {\r\n        eventListenerButton();\r\n        verificarIdUser();\r\n    });\r\n\r\n    const verificarIdUser = () => {\r\n        const storedUserId = localStorage.getItem(\"userId\");\r\n\r\n        if (storedUserId) {\r\n            console.log(\"Usuario ya registrado\");\r\n            userIdInput.value = storedUserId;\r\n\r\n            botonSubmit.setAttribute(\"disabled\", true);\r\n            botonSubmit.classList.add(\"opacity-50\");\r\n            botonSubmit.classList.remove(\"hover:bg-blue-700\", \"hover:scale-95\")\r\n            contenedorGrupos.classList.remove(\"hidden\");\r\n\r\n            obtenerDatosDeUsuarios();\r\n        } else {\r\n            userIdInput.value = Math.floor(Math.random() * 1000000);\r\n            localStorage.setItem(\"userId\", userIdInput.value);\r\n        }\r\n    }\r\n\r\n    const eventListenerButton = function() {\r\n        botonSubmit.addEventListener(\"click\", (e) => {\r\n            limpiarAlertas();\r\n        \r\n            e.preventDefault();\r\n        \r\n            const nombre = inputNombre.value == \"\" ? insertarAlerta(\"error\", \"El campo nombre no puede estar vacío\") : inputNombre.value;\r\n            const apellido = inputApellido.value == \"\" ? insertarAlerta(\"error\", \"El campo apellido no puede estar vacío\") : inputApellido.value;\r\n            const grupo = inputGrupo.value == \"\" ? insertarAlerta(\"error\", \"El campo grupo no puede estar vacío\") : inputGrupo.value;\r\n            const id = userIdInput.value;    \r\n        \r\n            if (nombre && apellido && grupo) {\r\n                unirseAGrupo(id, nombre, apellido, grupo).then(() => {\r\n                    agregarUsuarioAlCard({ id, grupo, nombre, apellido });\r\n                    window.location.reload();\r\n                    console.log(\"Usuario registrado en grupo\");\r\n                }).catch(error => {\r\n                    console.error(\"Error al unirse al grupo:\", error);\r\n                });\r\n            } \r\n        })\r\n    }\r\n\r\n    function mostrarUsuariosEnCards(usuarios) {\r\n        const grupos = document.querySelector('.grupos');\r\n        grupos.innerHTML = ''; // Limpiar el contenedor de grupos existente\r\n    \r\n        // Agrupar usuarios por grupo\r\n        const usuariosPorGrupo = usuarios.reduce((acc, usuario) => {\r\n            (acc[usuario.grupo] = acc[usuario.grupo] || []).push(usuario);\r\n            return acc;\r\n        }, {});\r\n    \r\n        // Crear una card para cada grupo\r\n        Object.keys(usuariosPorGrupo).forEach(grupo => {\r\n            const card = document.createElement('div');\r\n            card.classList.add('card', 'p-4', 'mb-4', 'rounded-lg', 'shadow-lg'); // Añade tus clases de Tailwind aquí\r\n    \r\n            let cardContent = `<h2 class=\"text-xl font-bold mb-2 grupo-${grupo}\">Grupo ${grupo}</h2>`;\r\n            cardContent += '<ul>';\r\n    \r\n            usuariosPorGrupo[grupo].forEach(usuario => {\r\n                cardContent += `<li>${usuario.nombre} ${usuario.apellido}</li>`; // Asumiendo que cada usuario tiene nombre y apellido\r\n            });\r\n    \r\n            cardContent += '</ul>';\r\n            card.innerHTML = cardContent;\r\n    \r\n            grupos.appendChild(card);\r\n        });\r\n    }\r\n    function agregarUsuarioAlCard(usuario) {\r\n        let grupoCard = document.querySelector(\".grupo-\" + usuario.grupo);\r\n        \r\n        // Si no existe un card para el grupo, crearlo\r\n        if (!grupoCard) {\r\n            const grupos = document.querySelector('.grupos');\r\n            const card = document.createElement('div');\r\n            card.classList.add('card', 'p-4', 'mb-4', 'rounded-lg', 'shadow-lg'); // Añade tus clases de Tailwind aquí\r\n    \r\n            let cardContent = `<h2 class=\"text-xl font-bold mb-2 grupo-${usuario.grupo}\">Grupo ${usuario.grupo}</h2>`;\r\n            cardContent += '<ul>';\r\n            cardContent += `<li>${usuario.nombre} ${usuario.apellido}</li>`;\r\n            cardContent += '</ul>';\r\n            card.innerHTML = cardContent;\r\n    \r\n            grupos.appendChild(card);\r\n        } else {\r\n            // Si ya existe, simplemente añade el usuario al card existente\r\n            const lista = grupoCard.querySelector('ul');\r\n            lista.innerHTML += `<li>${usuario.nombre} ${usuario.apellido}</li>`;\r\n        }\r\n    }\r\n\r\n    function obtenerDatosDeUsuarios() {\r\n        // Paso 1: Abrir una conexión a la base de datos\r\n        const request = indexedDB.open('miBaseDeDatos', 1);\r\n    \r\n        request.onsuccess = function(event) {\r\n            const db = event.target.result;\r\n    \r\n            // Paso 2: Iniciar una transacción de solo lectura en el almacén de objetos 'usuarios'\r\n            const transaction = db.transaction(['usuarios'], 'readonly');\r\n    \r\n            // Paso 3: Acceder al almacén de objetos\r\n            const store = transaction.objectStore('usuarios');\r\n    \r\n            // Paso 4: Usar un cursor para iterar sobre todos los registros del almacén\r\n            const cursorRequest = store.openCursor();\r\n    \r\n            // Inicializar un array vacío para almacenar los usuarios\r\n            const usuarios = [];\r\n    \r\n            cursorRequest.onsuccess = function(e) {\r\n                const cursor = e.target.result;\r\n                if (cursor) {\r\n                    // Agregar el usuario actual al array\r\n                    usuarios.push(cursor.value);\r\n                    cursor.continue();\r\n                } else {\r\n                    // Aquí ya se han recogido todos los usuarios\r\n                    console.log('Todos los usuarios:', usuarios);\r\n                }\r\n            };\r\n    \r\n            cursorRequest.onerror = function(event) {\r\n                console.error('Error al obtener los datos:', event.target.errorCode);\r\n            };\r\n    \r\n            // Opcional: Manejar el evento oncomplete de la transacción\r\n            transaction.oncomplete = function() {\r\n                // Aquí puedes trabajar con el array completo de usuarios\r\n                console.log('Transacción completada. Total de usuarios obtenidos:', usuarios.length);\r\n                // Por ejemplo, puedes llamar a otra función y pasarle el array de usuarios\r\n                mostrarUsuariosEnCards(usuarios);\r\n            };\r\n        };\r\n    \r\n        request.onerror = function(event) {\r\n            console.error('Error al abrir la base de datos:', event.target.errorCode);\r\n        };\r\n    }\r\n\r\n    function insertarRegistrosDePrueba() {\r\n        const usuariosDePrueba = [\r\n            { id: '1', grupo: '1', nombre: 'Nombre1', apellido: 'Apellido1' },\r\n            { id: '2', grupo: '1', nombre: 'Nombre2', apellido: 'Apellido2' },\r\n            { id: '3', grupo: '1', nombre: 'Nombre3', apellido: 'Apellido3' },\r\n            { id: '4', grupo: '1', nombre: 'Nombre4', apellido: 'Apellido4' },\r\n            { id: '5', grupo: '1', nombre: 'Nombre5', apellido: 'Apellido5' },\r\n            { id: '6', grupo: '2', nombre: 'Nombre6', apellido: 'Apellido6' },\r\n            { id: '7', grupo: '2', nombre: 'Nombre7', apellido: 'Apellido7' },\r\n            { id: '8', grupo: '2', nombre: 'Nombre8', apellido: 'Apellido8' },\r\n            { id: '9', grupo: '2', nombre: 'Nombre9', apellido: 'Apellido9' },\r\n            { id: '10', grupo: '3', nombre: 'Nombre10', apellido: 'Apellido10' },\r\n            { id: '11', grupo: '3', nombre: 'Nombre11', apellido: 'Apellido11' },\r\n            { id: '12', grupo: '3', nombre: 'Nombre12', apellido: 'Apellido12' },\r\n            { id: '13', grupo: '3', nombre: 'Nombre13', apellido: 'Apellido13' },\r\n            { id: '14', grupo: '3', nombre: 'Nombre14', apellido: 'Apellido14' },\r\n            { id: '15', grupo: '3', nombre: 'Nombre15', apellido: 'Apellido15' },\r\n            { id: '16', grupo: '4', nombre: 'Nombre16', apellido: 'Apellido16' },\r\n            { id: '17', grupo: '4', nombre: 'Nombre17', apellido: 'Apellido17' },\r\n            { id: '18', grupo: '4', nombre: 'Nombre18', apellido: 'Apellido18' },\r\n            { id: '19', grupo: '4', nombre: 'Nombre19', apellido: 'Apellido19' },\r\n            { id: '20', grupo: '4', nombre: 'Nombre20', apellido: 'Apellido20' },\r\n            { id: '21', grupo: '5', nombre: 'Nombre21', apellido: 'Apellido21' },\r\n            { id: '22', grupo: '5', nombre: 'Nombre22', apellido: 'Apellido22' },\r\n            { id: '23', grupo: '5', nombre: 'Nombre23', apellido: 'Apellido23' }\r\n        ];\r\n    \r\n        const request = indexedDB.open('miBaseDeDatos', 1);\r\n    \r\n        request.onsuccess = function(event) {\r\n            const db = event.target.result;\r\n            const transaction = db.transaction(['usuarios'], 'readwrite');\r\n            const store = transaction.objectStore('usuarios');\r\n    \r\n            usuariosDePrueba.forEach(usuario => {\r\n                const addRequest = store.add(usuario);\r\n    \r\n                addRequest.onsuccess = function() {\r\n                    console.log('Usuario insertado exitosamente:', usuario);\r\n                };\r\n    \r\n                addRequest.onerror = function(event) {\r\n                    console.error('Error al insertar el usuario:', event.target.error);\r\n                };\r\n            });\r\n        };\r\n    \r\n        request.onerror = function(event) {\r\n            console.error('Error al abrir la base de datos:', event.target.errorCode);\r\n        };\r\n    }\r\n})();\r\n\n\n//# sourceURL=webpack://grupos/./src/app.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/app.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;