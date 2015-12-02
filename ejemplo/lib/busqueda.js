// ======================= REQUIRES =========================
var fs = require("fs");

// ======================= FUNCIONES ========================

// ======================== EXPORTS =========================
module.exports = {
	// Función lectura de fichero (con Promise)
	//	> En fichero plano: devuelve el contenido leído.
	//	> En fichero JSON: devuelve el contenido interpretado o cadena vacía si el formato no es correcto.
	leer: function (fichero, json) {
		json = json || false;
		
		return new Promise(function (resolve, reject) {				
			fs.access(fichero, function(error) {
				var contenido;
				
				// Si existe el fichero, obtenemos su contenido completo
				if (!error) {
					// Intentamos leer el fichero
					fs.readFile(fichero, 'utf8', function(error, datos) {
						if (json) {
							try {
								contenido = JSON.parse(datos);
								
							} catch(e) {
								contenido = "";
							}
							
						} else {
							contenido = datos;
						}
						
						// Resolvemos la promesa con el resultado de la lectura
						resolve(contenido);
					});
					
				// Si no existe el fichero, rechazamos
				} else {
					reject({origen: "Busqueda>leer", mensaje: "Fichero no encontrado."});
				}
			});
		});
	},
	
	// Función búsqueda (con Promises)
	//		> En fichero plano: devuelve primera palabra que contenga el texto indicado (expresión regular)
	//		> En fichero JSON: devuelve bloque que contenga la propiedad 'nombre' con el valor indicado
	buscar: function (fichero, valor, json) {
		json = json || false;
		
		return this.leer(fichero, json).then(
			function(contenido) {	// resolve
				// Si el fichero y el valor a buscar no están vacíos, comenzamos la búsqueda
				if (contenido && valor) {
					return new Promise(
						function (resolve, reject) {
							var encontrado;
							
							if (json) {
								// Inicializamos el resultado
								encontrado = "";
								
								// Recorremos el contenido del fichero en busca del bloque que contenga el valor indicado
								for(var i=0; i < contenido.length; i++)
								{
									// Si encontramos coincidencia, guardamos los datos y dejamos de buscar
									if (contenido[i].nombre.toLowerCase() == valor.toLowerCase()) {
										encontrado = { nombre: contenido[i].nombre, escuderia: contenido[i].escuderia };
										
										break;
									}
								}
							
							} else {
								// Intentamos encontrar la primera palabra que contenga el contenido de 'valor'
								var patron = eval('/\\S*' + valor + '\\S*/i');
								var resBusqueda = patron.exec(contenido);

								if (resBusqueda) {
									encontrado = resBusqueda[0];
									
								} else {
									encontrado = "";
								}
							}
							
							
							// Si se ha encontrado un resultado, resolver la promesa.
							if (encontrado) {
								resolve(encontrado);
								
							// En otro caso, rechazarla.
							} else {
								reject({origen: "Busqueda>buscar", mensaje: "Valor no localizado."});
							}
						}
					);
					
				// El fichero o el valor a buscar son vacíos. Resolvemos una promesa con valor null.
				} else {
					return Promise.resolve(null);
				}	
			},
			
			function(error) {	// reject (leer)
				// Si hubo un error al leer, rechazamos una promesa con el mensaje obtenido
				return Promise.reject({origen: "Busqueda>buscar", mensaje: error.mensaje});
			}
		);
	}
}