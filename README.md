# App OptivaMagic
## Introducción
Este ejercicio consiste en tres partes: 
- Traer tres colecciones de cartas Magic desde la <a href="https://scryfall.com/docs/api"> API Scryfall </a> y salvarlas en una base de datos
- Disponibilizar un servicio con los métdos:
  - Consultar carta por id
  - Consultar cartas por nombre
  - Consultar cartas de una colección
  - Consultar cartas legales un un modo de juego concreto.
- Exponer una interfaz gráfica para poder hacer uso de este servicio.


## Diseño
### La solución

Para cargar la base de datos, se genera un evento diario encargado de la lectura de datos de la API Scryfall y los carga en la tabla `cards`.

![alt text1](https://front-api-magic.s3.eu-west-1.amazonaws.com/task.drawio.png)

El servicio de consulta de cartas es un servicio desarrollado con el framework: `express`. Esto va empaquetado en una funcion lambda y el montaje de la solucion es:

![alt text2](https://front-api-magic.s3.eu-west-1.amazonaws.com/cards+service.drawio.png)

Y el frontal ha sido expuesto publicamente en u S3, sin necesidad de levantar ningun tipo de maquina.

De manera que el diagrama de arquitectura de la solución final queda de la siguiente manera:

![alt text3](https://front-api-magic.s3.eu-west-1.amazonaws.com/solucion.drawio.png)

### Flujos
Para el servicio consulta de cartas y la tarea de carga de cartas, se definieron los siguientes diagramas de secuencia acorde al flujo indicado:

Tarea de carga de cartas en la tabla cartas:

![alt text4](https://front-api-magic.s3.eu-west-1.amazonaws.com/taskUploadDDBB.png)

Servicio consulta de cartas:

![alt text5](https://front-api-magic.s3.eu-west-1.amazonaws.com/GetCardByAttribute.png)


## Puesta en marcha
### Despliegue y Compilación

En el archivo `buildspec.yml` estan las instrucciones para la compilación del proyecto.
Las librerias usadas para el desarrollo han sido:
- axios: como cliente HTTP.
- express: para levantar un servidor dentro del proyecto NodeJS y poder gestionar las rutas y peticiones.
- express-validator: para validar la composicion de las peticiones que se realizan al servicio.
- serverless: es el compilador y el framework encargado de ejecutar el despliegue continuo.


Despues de haber terminado el despliegue, en los logs de la canalización podemos encontrar algo parecido a esto:

```bash
Deploying apiDbMagic to stage pre (eu-west-1)

✔ Service deployed to stack apiDbMagic-pre (47s)

endpoint: ANY - https://igv3shcb7k.execute-api.eu-west-1.amazonaws.com/pre/{proxy+}
functions:
  api: apiDbMagic-pre-api (20 MB)
  task: apiDbMagic-pre-task (20 MB)

```

Aqui se muestra el endpoint en el que se expondra el servicio que lleva la API como disparador.

### Invocación

Despues del despliegue satisfactorio podemos obtener el enpoint y llamarlo bajo el acuerdo de interfaces declarado en el swagger:

<a href="https://front-api-magic.s3.eu-west-1.amazonaws.com/swagger.yaml"> Acuerdo de interfaces </a>


## Acceso a la Interfaz

La interfaz gráfica en una web basica consumiendo la api con el servicio consulta de cartas. La web se encuentra alojada en un bucket S3 público:

<a href="https://front-api-magic.s3.eu-west-1.amazonaws.com/index.html#"> App Magic </a>