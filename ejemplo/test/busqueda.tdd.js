// ======================= REQUIRES =========================
var assert = require('chai').assert;
var expect = require('chai').expect;
var fs = require('fs');
var busqueda = require('../lib/busqueda.js');

// ======================= CONSTANTES =======================
const PATH_FICHEROS = './data_files';
const FICHERO_DUMMY = PATH_FICHEROS + '/dummy.txt';
const FICHERO_TXT = PATH_FICHEROS + '/datos.txt';
const FICHERO_JSON = PATH_FICHEROS + '/datos.json';
const FS_ACCESO_RW = fs.R_OK | fs.W_OK;

// ======================= VARIABLES ========================
var escribirTXT = crearEscritor(FICHERO_TXT);
var escribirJSON = crearEscritor(FICHERO_JSON);

// ======================= FUNCIONES ========================
// Crea un directorio
function crearDirectorio(directorio) {
	return new Promise(function(resolve, reject) {
		fs.stat(directorio, function(error, stats) {
			// Si no existe el directorio, lo creamos
			if (error && !stats) {
				fs.mkdir(directorio, function(error) {
					// Si hay un error, se rechaza la promesa.
					if (error) {
						reject({origen: "crearDirectorio", mensaje: "No se pudo crear: " + directorio});
						
					// Si se ha creado el directorio, se resuelve la promesa con valor true para indicar este caso.
					} else {
						resolve(true);
					}
				});
				
			// Si existe el directorio, no es un error. Se resuelve la promesa con valor false para indicar este caso.
			} else if (stats.isDirectory()) {
				resolve(false);
			
			// Cualquier otro error rechaza la promesa.
			} else {
				reject({origen: "crearDirectorio", mensaje: "Hubo un error al intentar crear: " + directorio});
			}
		});
	});
}

// Elimina un directorio
function eliminarDirectorio(directorio) {
	return new Promise(function(resolve, reject) {
		fs.stat(directorio, function(error, stats) {
			// Si existe el directorio, lo borramos
			if (!error && stats.isDirectory()) {
				fs.rmdir(directorio, function(error) {
					// Si hay un error, se rechaza la promesa.
					if (error) {
						reject({origen: "eliminarDirectorio", mensaje: "No se pudo eliminar: " + directorio});
						
					// Si se ha eliminado el directorio, se resuelve la promesa con valor true para indicar este caso.
					} else {
						resolve(true);
					}
				});
				
			// Si no existe el directorio, no es un error. Se resuelve la promesa con valor false para indicar este caso.
			} else if (error && !stats) {
				resolve(false);
				
			// Cualquier otro error rechaza la promesa.
			} else {
				reject({origen: "eliminarDirectorio", mensaje: "Hubo un error al intentar eliminar: " + directorio});
			}
		});
	});
}

// Elimina un fichero
function eliminarFichero(fichero) {
	return new Promise(function(resolve, reject) {
		// Se comprueba primero si el fichero existe para después borrarlo
		fs.access(fichero, function(error) {
			if (!error) {
				fs.unlink(fichero, function (error) {
					// Si hay un error, se rechaza la promesa.
					if (error) {
						reject({origen: "eliminarFichero", mensaje: "No se pudo borrar: " + fichero});
						
					// Si se ha borrado el fichero, se resuelve la promesa con valor true para indicar este caso.
					} else {
						resolve(true);
					}
				});
				
			// Si no existe el fichero, no es un error. Se resuelve la promesa con valor false para indicar este caso.
			} else {
				resolve(false);
			}
		});
	});
}

// Closure para escribir en ficheros de datos
function crearEscritor(fichero) {
	return function(contenido, append) {
		append = append || false;
		
		if (append) {
			return new Promise(function(resolve, reject) {
				// Se comprueba primero si el fichero existe y tiene permisos lectura/escritura
				fs.access(fichero, FS_ACCESO_RW, function(error) {
					if (!error) {
						// Se añade el nuevo contenido
						fs.appendFile(fichero, contenido, 'utf8', function (error) {
							// Si hay un error, se rechaza la promesa.
							if (error) {
								reject({origen: "Escritor", mensaje: "Hubo un fallo al escribir"});
								
							// Si se ha añadido correctamente, se resuelve la promesa con valor true para indicar este caso.
							} else {
								resolve(true);
							}
						});
						
					// Si hay un error, se rechaza la promesa.
					} else {
						reject({origen: "Escritor", mensaje: "El fichero no existe"});
					}
				});
			});
			
		} else {
			
			return new Promise(function(resolve, reject) {
				// Se escribe el contenido en el fichero
				fs.writeFile(fichero, contenido, 'utf8', function (error) {
					// Si hay un error, se rechaza la promesa.
					if (error) {
						reject({origen: "Escritor", mensaje: "Hubo un fallo al escribir"});
						
					// Si se ha escrito correctamente, se resuelve la promesa con valor true para indicar este caso.
					} else {
						resolve(true);
					}
				});
			});
		}
	} // return
}



// =================== BLOQUES DE PRUEBA ====================
describe("Busqueda", function(){
	describe("#leer()", function(){
		/**************************** Preparación de entorno *****************************/
		before(function() {
			// Creamos el directorio donde irán los ficheros de prueba
			return crearDirectorio(PATH_FICHEROS).then(
				function(creado) { // resolve
					if (creado) {
						console.log("\tDirectorio de ficheros de datos creado.\n");
					} else {
						console.log("\tYa existía el directorio de ficheros de datos.\n");
					}
				},
				
				function(error) { // reject
					throw new Error(error.mensaje);
				}
			);
		});
		
		beforeEach(function() {
			// Borramos los ficheros antes de cada iteración para partir con contenidos distintos
			return Promise.all([eliminarFichero(FICHERO_TXT), eliminarFichero(FICHERO_JSON)]).then(
				function() { // resolve
					//console.log("\n\tFicheros borrados para la siguiente iteración.");
				},
				
				function(error) { // reject
					throw new Error(error.mensaje);
				}
			);
		});
		
		after(function() {
			// // Borramos los ficheros al terminar todas la iteraciones
			return Promise.all([eliminarFichero(FICHERO_TXT), eliminarFichero(FICHERO_JSON)]).then(
				function() { // resolve
					console.log("\n\tLimpieza de ficheros.");
					// A continuación borramos el directorio
					return eliminarDirectorio(PATH_FICHEROS);
				},
				
				function(error) { // reject
					console.error(error.mensaje);
				}
			).then(
				function() { // resolve
					console.log("\tDirectorio de ficheros de datos eliminado.\n");
				},
				
				function(error) { // reject
					throw new Error(error.mensaje);
				}
			);
		});
		
		
		/******************************** Casos de prueba ********************************/
		it('1. Fichero no existente', function(){
			var promLectura = busqueda.leer(FICHERO_DUMMY);
			
			assert.instanceOf(promLectura, Promise, "Se esperaba una Promesa como resultado.");
			
			return promLectura.then(
				function () {	// resolve
					throw new Error("No se esperaba una resolución.");
				},
				
				function (error) {	// reject
					expect(error).to.have.property("mensaje");
					expect(error.mensaje).to.contain("no encontrado");
				}
			);
		});
		
		
		it('2. Fichero plano vacío', function(){
			// Escribimos/Creamos el fichero sin contenido
			return escribirTXT('').then(
				function(respuesta) { // resolve
					// A continuación, intentamos leer del fichero
					return busqueda.leer(FICHERO_TXT);
				},
				
				function(error) {	// reject
					throw new Error(error.mensaje);
				}
			).then(
				function (contenido) {	// resolve
					assert.notStrictEqual(contenido, null, "Se ha devuelto valor NULL.");
					assert.strictEqual(contenido, "", "Se han encontrado datos.");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);
		});
		
		it('3. Fichero plano no vacío', function(){
			// Escribimos/Creamos el fichero con contenido
			return escribirTXT('prueba3').then(
				function(respuesta) { // resolve
					// A continuación, intentamos leer del fichero
					return busqueda.leer(FICHERO_TXT);
				},
				
				function(error) {	// reject
					throw new Error(error.mensaje);
				}
			).then(
				function (contenido) {	// resolve
					assert.notStrictEqual(contenido, null, "Se ha devuelto valor NULL.");
					assert.notStrictEqual(contenido, "", "Se ha devuelto valor vacío.");
					assert.equal(contenido, "prueba3", "Se ha obtenido un contenido no esperado.");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);
		});
		
		// recuperar valor concreto
		
		it('4. Fichero JSON vacío', function(){
			// Escribimos/Creamos el fichero sin contenido
			return escribirJSON('').then(
				function(respuesta) { // resolve
					// A continuación, intentamos leer del fichero
					return busqueda.leer(FICHERO_JSON, true);
				},
				
				function(error) {	// reject
					throw new Error(error.mensaje);
				}
			).then(
				function (contenido) {	// resolve
					assert.notStrictEqual(contenido, null, "Se ha devuelto valor NULL.");
					assert.strictEqual(contenido, "", "Se han encontrado datos.");
					assert.isNotObject(contenido, "No se ha devuelto un objeto.");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);
		});
		
		it('5. Fichero JSON no vacío', function(){
			// Escribimos/Creamos el fichero con contenido
			return escribirJSON('{"prueba": 5}').then(
				function(respuesta) { // resolve
					// A continuación, intentamos leer del fichero
					return busqueda.leer(FICHERO_JSON, true);
				},
				
				function(error) {	// reject
					throw new Error(error.mensaje);
				}
			).then(
				function (contenido) {	// resolve
					assert.notStrictEqual(contenido, null, "Se ha devuelto valor NULL.");
					assert.notStrictEqual(contenido, "", "Se ha devuelto valor vacío.");
					assert.isObject(contenido, "No se ha devuelto un objeto.");
					expect(contenido).to.have.a.property("prueba");
					expect(contenido).to.have.a.property("prueba", 5);
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);
		});
		
		it('6. Fichero JSON sin propiedad "mensaje"', function(){
			// Escribimos/Creamos el fichero con contenido
			return escribirJSON('{"prueba": 6}').then(
				function(respuesta) { // resolve
					// A continuación, intentamos leer del fichero
					return busqueda.leer(FICHERO_JSON, true);
				},
				
				function(error) {	// reject
					throw new Error(error.mensaje);
				}
			).then(
				function (contenido) {	// resolve
					assert.notStrictEqual(contenido, null, "Se ha devuelto valor NULL.");
					assert.notStrictEqual(contenido, "", "Se ha devuelto valor vacío.");
					assert.isObject(contenido, "No se ha devuelto un objeto.");
					expect(contenido).to.have.a.property("prueba", 6);
					expect(contenido).not.to.have.a.property("mensaje");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);
		});
		
		it('7. Fichero JSON con propiedad "mensaje"', function(){
			// Escribimos/Creamos el fichero con contenido
			return escribirJSON('{"prueba": 7, "mensaje": "Esta es la prueba 7"}').then(
				function(respuesta) { // resolve
					// A continuación, intentamos leer del fichero
					return busqueda.leer(FICHERO_JSON, true);
				},
				
				function(error) {	// reject
					throw new Error(error.mensaje);
				}
			).then(
				function (contenido) {	// resolve					
					assert.notStrictEqual(contenido, null, "Se ha devuelto valor NULL.");
					assert.notStrictEqual(contenido, "", "Se ha devuelto valor vacío.");
					assert.isObject(contenido, "No se ha devuelto un objeto.");
					expect(contenido).to.have.a.property("prueba", 7);
					expect(contenido).not.to.have.a.property("nombre");
					expect(contenido).to.have.a.property("mensaje", "Esta es la prueba 7");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);	
		});
	}); // describe #leer
	
	
	
	describe("#buscar()", function(){
		/**************************** Preparación de entorno *****************************/
		before(function() {
			// Creamos el directorio donde irán los ficheros de prueba
			return crearDirectorio(PATH_FICHEROS).then(
				function(creado) { // resolve
					if (creado) {
						console.log("\tDirectorio de ficheros de datos creado.");
					} else {
						console.log("\tYa existía el directorio de ficheros de datos.");
					}
					// A continuación creamos los ficheros vacíos
					return Promise.all([escribirTXT(''), escribirJSON('')]);
				},
				
				function(error) { // reject
					throw new Error(error.mensaje);
				}
			).then(
				function() { // resolve
					console.log("\tFicheros iniciales creados.\n");
				},
				
				function(error) { // reject
					throw new Error(error.mensaje);
				}
			);
		});
		
		after(function() {			
			return Promise.all([eliminarFichero(FICHERO_TXT), eliminarFichero(FICHERO_JSON)]).then(
				function() { // resolve
					console.log("\n\tLimpieza de ficheros.");
					return eliminarDirectorio(PATH_FICHEROS);
				},
				
				function(error) { // reject
					throw new Error(error.mensaje);
				}
			).then(
				function() { // resolve
					console.log("\tDirectorio de ficheros de datos eliminado.\n");
				},
				
				function(error) { // reject
					throw new Error(error.mensaje);
				}
			);
		});
		
		
		/******************************** Casos de prueba ********************************/
		// >>> Pruebas en fichero inexistente
		it('01. Búsqueda de valor vacío en fichero inexistente', function(){
			var promBusqueda = busqueda.buscar(FICHERO_DUMMY, "");
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function () {	// resolve
					throw new Error("No se esperaba una resolución.");
				},
				
				function (error) {	// reject
					expect(error).to.have.property("mensaje");
					expect(error.mensaje).to.contain("no encontrado");
					
				}
			);
		});
		
		it('02. Búsqueda de valor en fichero inexistente', function(){
			var promBusqueda = busqueda.buscar(FICHERO_DUMMY, "texto1");
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function () {	// resolve
					throw new Error("No se esperaba una resolución.");
				},
				
				function (error) {	// reject
					expect(error).to.have.property("mensaje");
					expect(error.mensaje).to.contain("no encontrado");
					
				}
			);
		});
		
		// >>> Pruebas en fichero plano
		it('03. Búsqueda de valor vacío en fichero plano vacío', function(){
			var promBusqueda = busqueda.buscar(FICHERO_TXT, "");
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function (resultado) {	// resolve
					assert.strictEqual(resultado, null, "Se han encontrado datos.");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);
		});
		
		it('04. Búsqueda de valor en fichero plano vacío', function(){
			var promBusqueda = busqueda.buscar(FICHERO_TXT, "prueba4");
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function (resultado) {	// resolve
					assert.strictEqual(resultado, null, "Se han encontrado datos.");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);
		});
		
		it('05. Búsqueda de valor vacío en fichero plano con datos', function(){
			// Insertamos texto en el fichero
			return escribirTXT('El alerón trasero móvil, comúnmente conocido como DRS (Drag Reduction System), es un dispositivo introducido en la temporada 2011 de Fórmula 1.').then(
				function(respuesta) { // resolve
					// A continuación, iniciamos la búsqueda
					return busqueda.buscar(FICHERO_TXT, "");
				},
				
				function(error) {	// reject
					throw new Error(error.mensaje);
				}
			).then(
				function (resultado) {	// resolve
					assert.strictEqual(resultado, null, "Se han encontrado datos.");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);
		});
		
		it('06. Búsqueda de valor inexistente en fichero plano con datos', function(){
			var promBusqueda = busqueda.buscar(FICHERO_TXT, "prueba6");
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function () {	// resolve
					throw new Error("No se esperaba una resolución.");
				},
				
				function (error) {	// reject
					expect(error).to.have.property("mensaje");
					expect(error.mensaje).to.contain("no localizado");
				}
			);
		});
		
		it('07. Búsqueda de valor existente en fichero plano con datos adicionales', function(){
			// Añadimos texto nuevo en el fichero
			return escribirTXT('Esto reduce la carga aerodinámica del monoplaza y aumenta su velocidad para facilitar los adelantamientos.', true).then(
				function(respuesta) { // resolve
					// A continuación, iniciamos la búsqueda
					return busqueda.buscar(FICHERO_TXT, "monoplaza");
				},
				
				function(error) {	// reject
					throw new Error(error.mensaje);
				}
			).then(
				function (resultado) {	// resolve
					expect(resultado).equal("monoplaza", "El resultado no contiene el valor esperado.");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);
		});
		
		it('08. Búsqueda de valor parcial en fichero plano con datos', function(){
			var promBusqueda = busqueda.buscar(FICHERO_TXT, "co");
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function (resultado) {	// resolve
					assert.equal(resultado, "comúnmente", "El resultado no contiene el valor esperado.");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);
		});
		
		
		// >>> Pruebas en fichero JSON
		it('09. Búsqueda de valor vacío en fichero JSON vacío', function(){
			var promBusqueda = busqueda.buscar(FICHERO_JSON, "", true);
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function (resultado) {	// resolve
					assert.strictEqual(resultado, null, "Se han encontrado datos.");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
					
				}
			);
		});
		
		it('10. Búsqueda de valor en fichero JSON vacío', function(){
			var promBusqueda = busqueda.buscar(FICHERO_JSON, "prueba10", true);
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function (resultado) {	// resolve
					assert.strictEqual(resultado, null, "Se han encontrado datos.");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);
		});
		
		it('11. Búsqueda de valor vacío en fichero JSON con datos', function(){
			// Insertamos texto en el fichero
			return escribirJSON('[{"nombre": "Hamilton", "escuderia": "Mercedes"},{"nombre": "Vettel", "escuderia": "Ferrari"}]').then(
				function(respuesta) { // resolve
					// A continuación, iniciamos la búsqueda
					return busqueda.buscar(FICHERO_JSON, "", true);
				},
				
				function(error) {	// reject
					throw new Error(error.mensaje);
				}
			).then(
				function (resultado) {	// resolve
					assert.strictEqual(resultado, null, "Se han encontrado datos.");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);
		});
		
		it('12. Búsqueda de valor inexistente en fichero JSON con datos', function(){
			var promBusqueda = busqueda.buscar(FICHERO_JSON, "Massa", true);
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function () {	// resolve
					throw new Error("No se esperaba una resolución.");
				},
				
				function (error) {	// reject
					expect(error).to.have.property("mensaje");
					expect(error.mensaje).to.contain("no localizado");
					
				}
			);
		});
		
		it('13. Búsqueda de valor existente en fichero JSON con datos', function(){
			var promBusqueda = busqueda.buscar(FICHERO_JSON, "Vettel", true);
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function (resultado) {	// resolve
					assert.isObject(resultado, "Se esperaba un objeto como resultado.");
					expect(resultado).to.have.a.property("nombre", "Vettel");
					expect(resultado).to.have.a.property("escuderia", "Ferrari");
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
					
				}
			);
		});
		
		it('14. Búsqueda de valor existente en fichero JSON con datos adicionales', function(){
			// Añadimos texto nuevo en el fichero
			return escribirJSON('[{"nombre": "Hamilton", "escuderia": "Mercedes"},{"nombre": "Vettel", "escuderia": "Ferrari"},{"nombre": "Massa", "escuderia": "Williams"}]').then(
				function(respuesta) { // resolve
					// A continuación, iniciamos la búsqueda
					return busqueda.buscar(FICHERO_JSON, "Massa", true);
				},
				
				function(error) {	// reject
					throw new Error(error.mensaje);
				}
			).then(
				function (resultado) {	// resolve
					assert.isObject(resultado, "Se esperaba un objeto como resultado.");
					expect(resultado).to.have.a.property("nombre");
					expect(resultado).to.have.a.property("escuderia");
					expect(resultado).to.deep.equal({nombre: "Massa", escuderia: "Williams"});
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
				}
			);
		});
		
		it('15. Búsqueda de valor case-insensitive en fichero JSON con datos', function(){
			var promBusqueda = busqueda.buscar(FICHERO_JSON, "hAmilTon", true);
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function (resultado) {	// resolve					
					assert.isNotNull(resultado, "Se esperaba un objeto como resultado.");
					expect(resultado).to.deep.equal({nombre: "Hamilton", escuderia: "Mercedes"});
				},
				
				function (error) {	// reject
					throw new Error("No se esperaba un rechazo (" + error.mensaje + ").");
					
				}
			);
		});
	}); // describe #buscar
});