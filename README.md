# busquedaTDD
Tarea grunt para hacer pruebas unitarias sobre un módulo de búsquedas en fichero

# Descripción
El módulo de búsqueda es un pequeño script que puede operar en ficheros de dos maneras: texto plano o JSON.
## Ficheros texto plano ##
Se debe indicar una cadena a buscar y el resultado podrá ser:
- La primera palabra que contenga la cadena a buscar.
- Valor null si no hay coincidencia.

> **Ejemplo**: Si tenemos el texto "Hoy hemos hecho un ejemplo" y buscamos "he", obtendremos "hemos" como resultado.

## Ficheros JSON ##
Se espera que el formato de cada bloque sea {nombre: , escuderia: } para simplificar la funcionalidad ya que sólo se utilizará para aprender a trabajar con pruebas unitarias.
Las búsquedas en este caso intentarán localizar un bloque que contenga el nombre indicado y devolverá:
- El par {nombre, escuderia} con los valores correspondientes.
- Valor null si no hay coincidencia.

> **Ejemplo**: Si tenemos un fichero con [{nombre: "Antonio", escuderia: "Mercedes"}, {nombre: "Manolo", escuderia: "Sauber"}] y lanzamos una búsqueda por "Manolo", el resultado sería {nombre: "Manolo", escuderia: "Sauber"}.


Gracias a Gonzalo por descubrirme todo un mundo nuevo en el que sumergirme.
