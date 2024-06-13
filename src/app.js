(function() {
    // Paso 1: Abrir una conexión a IndexedDB
    const request = indexedDB.open('miBaseDeDatos', 1);

    // Paso 2: Crear el almacén de objetos si no existe
    request.onupgradeneeded = function(event) {
    const db = event.target.result;
    
    // Crear un almacén de objetos con 'id' como clave primaria
    if (!db.objectStoreNames.contains('usuarios')) {
        const objectStore = db.createObjectStore('usuarios', { keyPath: 'id' });
        // Crear un índice para buscar usuarios por grupo, si es necesario
        objectStore.createIndex('porGrupo', 'grupo', { unique: false });
    }
    };

    request.onsuccess = function(event) {
    console.log('Base de datos abierta exitosamente');
    obtenerDatosDeUsuarios();
    };

    request.onerror = function(event) {
    console.error('Error al abrir la base de datos:', event.target.errorCode);
    };

    const inputNombre = document.getElementById("nombre");
    const inputApellido = document.getElementById("apellido");
    const inputGrupo = document.getElementById("grupo");
    const formulario = document.getElementById("formulario");
    const botonSubmit = document.getElementById("submit");
    const userIdInput = document.getElementById("usuarioId");
    const contenedorGrupos = document.querySelector(".grupos-section");

    function unirseAGrupo(idUsuario, nombre, apellido, grupo) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('miBaseDeDatos', 1);
    
            request.onsuccess = function(event) {
                const db = event.target.result;
                const transaction = db.transaction(['usuarios'], 'readwrite');
                const store = transaction.objectStore('usuarios');
                const usuario = { id: idUsuario, nombre: nombre, apellido: apellido, grupo: grupo };
                const addRequest = store.add(usuario);
    
                addRequest.onsuccess = function() {
                    console.log('Usuario insertado exitosamente en el grupo:', grupo);
                    resolve();
                };
    
                addRequest.onerror = function(event) {
                    console.error('Error al insertar el usuario:', event.target.error);
                    reject(event.target.error);
                };
            };
    
            request.onerror = function(event) {
                console.error('Error al abrir la base de datos:', event.target.errorCode);
                reject(event.target.errorCode);
            };
        });
    }

      const insertarAlerta = (tipo, mensaje) => {
        const alerta = document.createElement("div");
    
        // Corrige el texto en el caso de éxito para que muestre "Éxito" en lugar de "Error"
        if (tipo === "error") {
            alerta.innerHTML = `
                <div class="bg-orange-100 border-l-4 border-red-500 text-red-700 p-3 rounded-md alert" role="alert">
                <p><b>Error! </b>${mensaje}</p>
                </div>
            `;
        } else if (tipo === "exito") {
            alerta.innerHTML = `
                <div class="bg-orange-100 border-l-4 border-green-500 text-green-700 p-4 alert" role="alert">
                <p><b>Exito! </b>${mensaje}</p>
                </div>
            `;
        }
    
        formulario.insertBefore(alerta, formulario.firstChild);
        // setTimeout(() => alerta.remove(), 5000);
    
        return false;
    };
    
    const limpiarAlertas = () => {
        const alertas = document.querySelectorAll(".alert");
        alertas.forEach(alerta => alerta.remove());
    }
    
    document.addEventListener("DOMContentLoaded", () => {
        eventListenerButton();
        verificarIdUser();
    });

    const verificarIdUser = () => {
        const storedUserId = localStorage.getItem("userId");

        if (storedUserId) {
            console.log("Usuario ya registrado");
            userIdInput.value = storedUserId;

            botonSubmit.setAttribute("disabled", true);
            botonSubmit.classList.add("opacity-50");
            botonSubmit.classList.remove("hover:bg-blue-700", "hover:scale-95")
            contenedorGrupos.classList.remove("hidden");

            obtenerDatosDeUsuarios();
        } else {
            userIdInput.value = Math.floor(Math.random() * 1000000);
            localStorage.setItem("userId", userIdInput.value);
        }
    }

    const eventListenerButton = function() {
        botonSubmit.addEventListener("click", (e) => {
            limpiarAlertas();
        
            e.preventDefault();
        
            const nombre = inputNombre.value == "" ? insertarAlerta("error", "El campo nombre no puede estar vacío") : inputNombre.value;
            const apellido = inputApellido.value == "" ? insertarAlerta("error", "El campo apellido no puede estar vacío") : inputApellido.value;
            const grupo = inputGrupo.value == "" ? insertarAlerta("error", "El campo grupo no puede estar vacío") : inputGrupo.value;
            const id = userIdInput.value;    
        
            if (nombre && apellido && grupo) {
                unirseAGrupo(id, nombre, apellido, grupo).then(() => {
                    agregarUsuarioAlCard({ id, grupo, nombre, apellido });
                    window.location.reload();
                    console.log("Usuario registrado en grupo");
                }).catch(error => {
                    console.error("Error al unirse al grupo:", error);
                });
            } 
        })
    }

    function mostrarUsuariosEnCards(usuarios) {
        const grupos = document.querySelector('.grupos');
        grupos.innerHTML = ''; // Limpiar el contenedor de grupos existente
    
        // Agrupar usuarios por grupo
        const usuariosPorGrupo = usuarios.reduce((acc, usuario) => {
            (acc[usuario.grupo] = acc[usuario.grupo] || []).push(usuario);
            return acc;
        }, {});
    
        // Crear una card para cada grupo
        Object.keys(usuariosPorGrupo).forEach(grupo => {
            const card = document.createElement('div');
            card.classList.add('card', 'p-4', 'mb-4', 'rounded-lg', 'shadow-lg'); // Añade tus clases de Tailwind aquí
    
            let cardContent = `<h2 class="text-xl font-bold mb-2 grupo-${grupo}">Grupo ${grupo}</h2>`;
            cardContent += '<ul>';
    
            usuariosPorGrupo[grupo].forEach(usuario => {
                cardContent += `<li>${usuario.nombre} ${usuario.apellido}</li>`; // Asumiendo que cada usuario tiene nombre y apellido
            });
    
            cardContent += '</ul>';
            card.innerHTML = cardContent;
    
            grupos.appendChild(card);
        });
    }
    function agregarUsuarioAlCard(usuario) {
        let grupoCard = document.querySelector(".grupo-" + usuario.grupo);
        
        // Si no existe un card para el grupo, crearlo
        if (!grupoCard) {
            const grupos = document.querySelector('.grupos');
            const card = document.createElement('div');
            card.classList.add('card', 'p-4', 'mb-4', 'rounded-lg', 'shadow-lg'); // Añade tus clases de Tailwind aquí
    
            let cardContent = `<h2 class="text-xl font-bold mb-2 grupo-${usuario.grupo}">Grupo ${usuario.grupo}</h2>`;
            cardContent += '<ul>';
            cardContent += `<li>${usuario.nombre} ${usuario.apellido}</li>`;
            cardContent += '</ul>';
            card.innerHTML = cardContent;
    
            grupos.appendChild(card);
        } else {
            // Si ya existe, simplemente añade el usuario al card existente
            const lista = grupoCard.querySelector('ul');
            lista.innerHTML += `<li>${usuario.nombre} ${usuario.apellido}</li>`;
        }
    }

    function obtenerDatosDeUsuarios() {
        // Paso 1: Abrir una conexión a la base de datos
        const request = indexedDB.open('miBaseDeDatos', 1);
    
        request.onsuccess = function(event) {
            const db = event.target.result;
    
            // Paso 2: Iniciar una transacción de solo lectura en el almacén de objetos 'usuarios'
            const transaction = db.transaction(['usuarios'], 'readonly');
    
            // Paso 3: Acceder al almacén de objetos
            const store = transaction.objectStore('usuarios');
    
            // Paso 4: Usar un cursor para iterar sobre todos los registros del almacén
            const cursorRequest = store.openCursor();
    
            // Inicializar un array vacío para almacenar los usuarios
            const usuarios = [];
    
            cursorRequest.onsuccess = function(e) {
                const cursor = e.target.result;
                if (cursor) {
                    // Agregar el usuario actual al array
                    usuarios.push(cursor.value);
                    cursor.continue();
                } else {
                    // Aquí ya se han recogido todos los usuarios
                    console.log('Todos los usuarios:', usuarios);
                }
            };
    
            cursorRequest.onerror = function(event) {
                console.error('Error al obtener los datos:', event.target.errorCode);
            };
    
            // Opcional: Manejar el evento oncomplete de la transacción
            transaction.oncomplete = function() {
                // Aquí puedes trabajar con el array completo de usuarios
                console.log('Transacción completada. Total de usuarios obtenidos:', usuarios.length);
                // Por ejemplo, puedes llamar a otra función y pasarle el array de usuarios
                mostrarUsuariosEnCards(usuarios);
            };
        };
    
        request.onerror = function(event) {
            console.error('Error al abrir la base de datos:', event.target.errorCode);
        };
    }

    function insertarRegistrosDePrueba() {
        const usuariosDePrueba = [
            { id: '1', grupo: '1', nombre: 'Nombre1', apellido: 'Apellido1' },
            { id: '2', grupo: '1', nombre: 'Nombre2', apellido: 'Apellido2' },
            { id: '3', grupo: '1', nombre: 'Nombre3', apellido: 'Apellido3' },
            { id: '4', grupo: '1', nombre: 'Nombre4', apellido: 'Apellido4' },
            { id: '5', grupo: '1', nombre: 'Nombre5', apellido: 'Apellido5' },
            { id: '6', grupo: '2', nombre: 'Nombre6', apellido: 'Apellido6' },
            { id: '7', grupo: '2', nombre: 'Nombre7', apellido: 'Apellido7' },
            { id: '8', grupo: '2', nombre: 'Nombre8', apellido: 'Apellido8' },
            { id: '9', grupo: '2', nombre: 'Nombre9', apellido: 'Apellido9' },
            { id: '10', grupo: '3', nombre: 'Nombre10', apellido: 'Apellido10' },
            { id: '11', grupo: '3', nombre: 'Nombre11', apellido: 'Apellido11' },
            { id: '12', grupo: '3', nombre: 'Nombre12', apellido: 'Apellido12' },
            { id: '13', grupo: '3', nombre: 'Nombre13', apellido: 'Apellido13' },
            { id: '14', grupo: '3', nombre: 'Nombre14', apellido: 'Apellido14' },
            { id: '15', grupo: '3', nombre: 'Nombre15', apellido: 'Apellido15' },
            { id: '16', grupo: '4', nombre: 'Nombre16', apellido: 'Apellido16' },
            { id: '17', grupo: '4', nombre: 'Nombre17', apellido: 'Apellido17' },
            { id: '18', grupo: '4', nombre: 'Nombre18', apellido: 'Apellido18' },
            { id: '19', grupo: '4', nombre: 'Nombre19', apellido: 'Apellido19' },
            { id: '20', grupo: '4', nombre: 'Nombre20', apellido: 'Apellido20' },
            { id: '21', grupo: '5', nombre: 'Nombre21', apellido: 'Apellido21' },
            { id: '22', grupo: '5', nombre: 'Nombre22', apellido: 'Apellido22' },
            { id: '23', grupo: '5', nombre: 'Nombre23', apellido: 'Apellido23' }
        ];
    
        const request = indexedDB.open('miBaseDeDatos', 1);
    
        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(['usuarios'], 'readwrite');
            const store = transaction.objectStore('usuarios');
    
            usuariosDePrueba.forEach(usuario => {
                const addRequest = store.add(usuario);
    
                addRequest.onsuccess = function() {
                    console.log('Usuario insertado exitosamente:', usuario);
                };
    
                addRequest.onerror = function(event) {
                    console.error('Error al insertar el usuario:', event.target.error);
                };
            });
        };
    
        request.onerror = function(event) {
            console.error('Error al abrir la base de datos:', event.target.errorCode);
        };
    }
})();
