# busquedaTDD
Tarea grunt para hacer pruebas unitarias sobre un módulo de búsquedas en fichero

## Descripción ##
La finalidad de este proyecto es aprender a trabajar con pruebas unitarias bajo NodeJS.

Para ello, se ha construido un pequeño módulo de búsqueda (ejemplo/lib/busqueda.js) que puede operar con ficheros de dos maneras: texto plano o JSON.

**Nota**: Para simplificar la funcionalidad de los ficheros JSON, se espera que el formato de cada bloque sea {nombre: , escuderia: } ya que sólo se trata de practicar con las pruebas unitarias.

El módulo de búsqueda contiene dos funciones:

* leer(fichero, json): Accede a un fichero y devuelve el contenido completo del mismo.

>**Parámetros**
>- fichero: ruta del fichero al que se va a acceder.
>- json: sirve para indicar si el fichero está en formato JSON (true) o no (false, por defecto).

>**Posibles valores devueltos**
>- El contenido del fichero, si la lectura es correcta.
>- Cadena vacía (""), si el fichero está vacío o el formato JSON no es correcto.
>- null, si el fichero no existe.

> **Ejemplos**
>- leer(fichero_inexistente) => [null]
>- leer(fichero_vacío) => [""]
>- leer(fichero_vacío, true) => [""]
>- leer(fichero_válido) => [contenido del fichero]


* buscar(fichero, valor, json): Intenta localizar "valor" dentro de un fichero.
En el caso de ficheros planos (json = false), la búsqueda se hará mediante un patrón para encontrar la primera palabra que contenga "valor".
Para ficheros JSON (json = true), se localizará el par cuya propiedad "nombre" coincida con "valor".

>**Parámetros**
>- fichero: ruta del fichero al que se va a acceder.
>- valor: es el valor a buscar dentro del fichero.
>- json: sirve para indicar si el fichero está en formato JSON (true) o no (false, por defecto).

>**Posibles valores devueltos**
>- El valor encontrado, como texto si el fichero no es JSON, o como un par {nombre, escuderia} si es JSON.
>- null, si el valor no se ha encontrado.

> **Ejemplos**
>- buscar(fichero_inexistente, valor_a_buscar) => [null]
>- buscar(fichero_inexistente, valor_a_buscar, true) => [null]
>- buscar(fichero_vacío, valor_a_buscar) => [""]
>- buscar(fichero_vacío, valor_a_buscar, true) => [""]
>- buscar(fichero_válido, valor_a_buscar) => [primera palabra que encaje con valor_a_buscar]
>- buscar(fichero_válido, valor_a_buscar, true) => [par {nombre, escuderia} que contenga valor_a_buscar como nombre]

## Pruebas unitarias ##
El script de pruebas unitarias (ejemplo/test/busqueda.tdd.js) se ha creado para ser usado con Mocha y Chai.
En los distintos casos de prueba se crearán y modificarán dos ficheros de prueba (uno para texto plano y otro para JSON) que después serán eliminados al finalizar cada conjunto de pruebas.

En total hay 7 casos de prueba para la función "leer" y 14 para "buscar", con los que se intenta probar que la funcionalidad de ambas es la esperada.



*Gracias a Gonzalo por descubrirme todo un mundo nuevo en el que sumergirme.*
