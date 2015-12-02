// ======================= CONSTANTES =======================
const PATH_FICHEROS = './data_files';
const FICHERO_DUMMY = PATH_FICHEROS + '/dummy.txt';
const FICHERO_TXT = PATH_FICHEROS + '/datos.txt';
const FICHERO_JSON = PATH_FICHEROS + '/datos.json';

// ======================= VARIABLES ========================
var assert = require('chai').assert;
var expect = require('chai').expect;
var fs = require('fs');

var busqueda = require('../lib/busqueda.js');

var escribirTXT = crearEscritor(FICHERO_TXT);
var escribirJSON = crearEscritor(FICHERO_JSON);

// ======================= FUNCIONES ========================
// Closure para escribir en ficheros de datos
function crearEscritor(fichero) {
	return function(contenido, append) {
		append = append || false;
		
		if (append) {
			if (fs.existsSync(fichero)) {
				fs.appendFileSync(fichero, contenido, 'utf8');
			}
			
		} else {
			fs.writeFileSync(fichero, contenido, 'utf8');
		}
	}
}


// =================== BLOQUES DE PRUEBA ====================
describe("Busqueda", function(){
	describe("#leer()", function(){
		/**************************** Preparación de entorno *****************************/
		before(function() {
			if (!fs.existsSync(PATH_FICHEROS)) {
				console.log("\tCreando directorio de ficheros de datos...\n");
				
				fs.mkdirSync(PATH_FICHEROS);
			}
		});
		
		beforeEach(function() {
			if (fs.existsSync(FICHERO_TXT)) {
				fs.unlinkSync(FICHERO_TXT);
			}
			
			if (fs.existsSync(FICHERO_JSON)) {
				fs.unlinkSync(FICHERO_JSON);
			}
		});
		
		after(function() {
			console.log("\n\tLimpiando directorio de ficheros de datos...\n");
			
			if (fs.existsSync(FICHERO_TXT)) {
				fs.unlinkSync(FICHERO_TXT);
			}
			
			if (fs.existsSync(FICHERO_JSON)) {
				fs.unlinkSync(FICHERO_JSON);
			}
			
			if (fs.existsSync(PATH_FICHEROS)) {
				fs.rmdirSync(PATH_FICHEROS);
			}
		});
		
		
		/******************************** Casos de prueba ********************************/
		it('1. Fichero no existente', function(){
			var result = busqueda.leer(FICHERO_DUMMY);
			
			assert.strictEqual(result, null, "Se han encontrado datos.");
		});
		
		
		it('2. Fichero plano vacío', function(){
			escribirTXT('');
			
			var result = busqueda.leer(FICHERO_TXT);
			
			assert.notStrictEqual(result, null, "Se ha devuelto valor NULL.");
			assert.strictEqual(result, "", "Se han encontrado datos.");
		});
		
		it('3. Fichero plano no vacío', function(){
			escribirTXT('prueba1');
			
			var result = busqueda.leer(FICHERO_TXT);
			
			assert.notStrictEqual(result, null, "Se ha devuelto valor NULL.");
			assert.notStrictEqual(result, "", "Se ha devuelto valor vacío.");
		});
		
		// recuperar valor concreto
		
		it('4. Fichero JSON vacío', function(){
			escribirJSON('');
			
			var result = busqueda.leer(FICHERO_JSON, true);
			
			assert.notStrictEqual(result, null, "Se ha devuelto valor NULL.");
			assert.strictEqual(result, "", "Se han encontrado datos.");
		});
		
		it('5. Fichero JSON no vacío', function(){
			escribirJSON('{"prueba": 5}');
			
			var result = busqueda.leer(FICHERO_JSON, true);
			
			assert.notStrictEqual(result, null, "Se ha devuelto valor NULL.");
			assert.notStrictEqual(result, "", "Se ha devuelto valor vacío.");
		});
		
		it('6. Fichero JSON sin propiedad "mensaje"', function(){
			escribirJSON('{"prueba": 6}');
			
			var result = busqueda.leer(FICHERO_JSON, true);
			
			assert.notStrictEqual(result, null, "Se ha devuelto valor NULL.");
			assert.notStrictEqual(result, "", "Se ha devuelto valor vacío.");
			expect(result).not.to.have.a.property("mensaje");
		});
		
		it('7. Fichero JSON con propiedad "mensaje"', function(){
			escribirJSON('{"prueba": 7, "mensaje": "texto del mensaje"}');
			
			var result = busqueda.leer(FICHERO_JSON, true);
			
			assert.notStrictEqual(result, null, "Se ha devuelto valor NULL.");
			assert.notStrictEqual(result, "", "Se ha devuelto valor vacío.");
			assert.isObject(result, "No se ha devuelto un objeto.");
			expect(result).to.have.a.property("mensaje");
			
		});
	});
	
	
	
	describe("#buscar()", function(){
		/**************************** Preparación de entorno *****************************/
		before(function() {
			if (!fs.existsSync(PATH_FICHEROS)) {
				console.log("\tCreando directorio de ficheros de datos...\n");
				
				fs.mkdirSync(PATH_FICHEROS);
			}
		
			// Dejar los ficheros vacíos
			escribirTXT('');
			escribirJSON('');
		});
		
		after(function() {
			console.log("\n\tLimpiando directorio de ficheros de datos...\n");
			
			if (fs.existsSync(FICHERO_TXT)) {
				fs.unlinkSync(FICHERO_TXT);
			}
			
			if (fs.existsSync(FICHERO_JSON)) {
				fs.unlinkSync(FICHERO_JSON);
			}
			
			if (fs.existsSync(PATH_FICHEROS)) {
				fs.rmdirSync(PATH_FICHEROS);
			}
		});
		
		
		/******************************** Casos de prueba ********************************/
		it('01. Búsqueda de valor vacío en fichero inexistente', function(){
			var result = busqueda.buscar(FICHERO_DUMMY, "");
			
			assert.strictEqual(result, null, "Se han encontrado datos.");
		});
		
		it('02. Búsqueda de valor en fichero inexistente', function(){
			var result = busqueda.buscar(FICHERO_DUMMY, "texto1");
			
			assert.strictEqual(result, null, "Se han encontrado datos.");
		});
		
		// >>> Pruebas en fichero plano
		it('03. Búsqueda de valor vacío en fichero plano vacío', function(){
			var result = busqueda.buscar(FICHERO_TXT, "");
	
			assert.strictEqual(result, null, "Se han encontrado datos.");
		});
		
		it('04. Búsqueda de valor en fichero plano vacío', function(){
			var result = busqueda.buscar(FICHERO_TXT, "texto1");
	
			assert.strictEqual(result, null, "Se han encontrado datos.");
		});
		
		it('05. Búsqueda de valor vacío en fichero plano con datos', function(){
			// Insertamos texto en el fichero
			escribirTXT('El alerón trasero móvil, comúnmente conocido como DRS (Drag Reduction System), es un dispositivo introducido en la temporada 2011 de Fórmula 1.');
			
			var result = busqueda.buscar(FICHERO_TXT, "");
	
			assert.strictEqual(result, null, "Se han encontrado datos.");
		});
		
		it('06. Búsqueda de valor inexistente en fichero plano con datos', function(){
			var promBusqueda = busqueda.buscar(FICHERO_TXT, "monoplaza");
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function () {	// resolve
					throw new Error("No se esperaba una resolución.");
				},
				
				function (mensaje) {	// reject
					return expect(mensaje).to.contain("no encontrado");
				}
			);
		});
		
		it('07. Búsqueda de valor existente en fichero plano con datos', function(){
			// Añadimos texto nuevo al fichero
			escribirTXT('Esto reduce la carga aerodinámica del monoplaza y aumenta su velocidad para facilitar los adelantamientos.', true);
			
			var promBusqueda = busqueda.buscar(FICHERO_TXT, "monoplaza");
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function (valor) {	// resolve
					return expect(valor).equal("monoplaza", "El resultado no contiene el valor esperado.");
				},
				
				function () {	// reject
					throw new Error("No se esperaba un rechazo.");
				}
			);
		});
		
		it('08. Búsqueda de valor parcial en fichero plano con datos', function(){
			// Buscar la primera palabra que contenga "co"
			var promBusqueda = busqueda.buscar(FICHERO_TXT, "co");
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function (valor) {	// resolve
					return expect(valor).equal("comúnmente", "El resultado no contiene el valor esperado.");
				},
				
				function () {	// reject
					throw new Error("No se esperaba un rechazo.");
				}
			);
		});
		
		
		// >>> Pruebas en fichero JSON
		it('09. Búsqueda de valor vacío en fichero JSON vacío', function(){
			var result = busqueda.buscar(FICHERO_JSON, "", true);
	
			assert.strictEqual(result, null, "Se han encontrado datos.");
		});
		
		it('10. Búsqueda de valor en fichero JSON vacío', function(){
			var result = busqueda.buscar(FICHERO_JSON, "nombre1", true);
	
			assert.strictEqual(result, null, "Se han encontrado datos.");
		});
		
		it('11. Búsqueda de valor vacío en fichero JSON con datos', function(){
			// Insertar texto al fichero
			escribirJSON('[{"nombre": "Hamilton", "escuderia": "Mercedes"},{"nombre": "Vettel", "escuderia": "Ferrari"}]');
			
			var result = busqueda.buscar(FICHERO_JSON, "", true);
	
			assert.strictEqual(result, null, "Se han encontrado datos.");
		});
		
		it('12. Búsqueda de valor inexistente en fichero JSON con datos', function(){
			var promBusqueda = busqueda.buscar(FICHERO_JSON, "Massa", true);
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function () {	// resolve
					throw new Error("No se esperaba una resolución.");
				},
				
				function (mensaje) {	// reject
					return expect(mensaje).to.contain("no encontrado");
				}
			);
		});
		
		it('13. Búsqueda de valor existente en fichero JSON con datos', function(){
			// Reemplazar texto del fichero
			escribirJSON('[{"nombre": "Hamilton", "escuderia": "Mercedes"},{"nombre": "Vettel", "escuderia": "Ferrari"},{"nombre": "Massa", "escuderia": "Williams"}]');
			
			var promBusqueda = busqueda.buscar(FICHERO_JSON, "Massa", true);
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function (valor) {	// resolve
					var resEsperado = {
						nombre: "Massa",
						escuderia: "Williams"
					};
					
					return (assert.isObject(valor, "Se esperaba un objeto como resultado.") &&
							expect(valor).to.have.a.property("nombre") &&
							expect(valor).to.have.a.property("escuderia") &&
							expect(valor).to.deep.equal(resEsperado));
				},
				
				function () {	// reject
					throw new Error("No se esperaba un rechazo.");
				}
			);
		});
		
		it('14. Búsqueda de valor case-insensitive en fichero JSON con datos', function(){
			// Buscar la primera palabra que contenga "co"
			var promBusqueda = busqueda.buscar(FICHERO_JSON, "hAmilTon", true);
			
			assert.instanceOf(promBusqueda, Promise, "Se esperaba una Promesa como resultado.");
			
			return promBusqueda.then(
				function (valor) {	// resolve
					var resEsperado = {
						nombre: "Hamilton",
						escuderia: "Mercedes"
					};
					
					return (assert.isNotNull(valor, "Se esperaba un objeto como resultado.") &&
							expect(valor).to.have.a.property("nombre", "Hamilton") &&
							expect(valor).to.deep.equal(resEsperado));
				},
				
				function () {	// reject
					throw new Error("No se esperaba un rechazo.");
				}
			);
		});
		
		
	});
});