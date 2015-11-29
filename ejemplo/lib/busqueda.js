// ======================= VARIABLES ========================
var fs = require("fs");

// ======================= FUNCIONES ========================
function generarDuracion() {
	return Math.random() * 300;
}

// ======================== EXPORTS =========================
module.exports = {
	// Función lectura de fichero
	//	> En fichero plano: devuelve el contenido leído.
	//	> En fichero JSON: devuelve el contenido interpretado o cadena vacía si el formato no es correcto.
	leer: function (fichero, json) {
		json = json || false;
		
		// Si existe el fichero, obtenemos su contenido completo
		if (fs.existsSync(fichero)) {
			var contenido = fs.readFileSync(fichero, 'utf8').toString();
			
			if (json) {
				try {
					return JSON.parse(contenido);
					
				} catch(e) {
					return "";
				}
				
			} else {
				return contenido;
			}
			
		// Si no existe el fichero, devolvemos NULL
		} else {
			return null;
		}
	},
	
	// Función búsqueda (con Promise y asincronismo simulado)
	//		> En fichero plano: devuelve primera palabra que contenga el texto indicado (expresión regular)
	//		> En fichero JSON: devuelve bloque que contenga la propiedad 'nombre' con el valor indicado
	buscar: function (fichero, valor, json) {
		json = json || false;
		
		var promResultado;
		var contenido = this.leer(fichero, json);
		
		// Si el fichero y el valor a buscar no están vacíos, comenzamos la búsqueda
		if (contenido && valor) {
			promResultado = new Promise(
				function (resolve, reject) {
					var encontrado;
					
					if (json) {
						// Inicializamos el resultado
						encontrado = null;
						
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
							encontrado = null;
						}
					}
					
					
					// Simular duración de la búsqueda y ejecutar la función correspondiente
					setTimeout(
						function () {
							if (encontrado) {
								resolve(encontrado);
								
							} else {
								reject("Valor no encontrado.");
							}
						},
						generarDuracion()
					);
				}
			);
			
			// Devolvemos la promesa completa
			return promResultado;
			
		// El fichero o el valor a buscar son vacíos
		} else {
			return null;
		}
	}
}