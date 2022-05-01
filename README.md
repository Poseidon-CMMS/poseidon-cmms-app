# Poseidon CMMS APP
Un proyecto hecho por Mauricio Lima y Fernando Navarro, que es un producto del proyecto final de Ingeniería en Informática, Universidad Nacional de Mar del Plata.

![Logo](https://i.ibb.co/cNmHj0P/logo256.png)

## Resumen

El presente sistema proporcionará apoyo en la toma de decisiones relacionadas al mantenimiento de dispositivos de medición agropecuarios. Estos dispositivos se encargan de monitorear equipos en tiempo real para permitir al productor agrícola una mejor supervisión de sus equipos, ahorrando tiempo, dinero y agua. 
Se enmarca en el tipo de software llamado CMMS (Computerized Maintenance Management System, Sistema computarizado de gestión del mantenimiento). Un CMMS es un sistema que busca ayudar en la gestión de mantenimiento de los activos de una empresa. 

***

## Participantes
***
Participantes que contribuyeron al proyecto:
* [Mauricio Lima](https://github.com/NavarroFer) 
* [Fernando Navarro](https://github.com/mau-lima)


## Instrucciones

Este repositorio incluye el frontend de Poseidón CMMS destinado al uso cotidiano por parte de usuarios administradores y técnicos. Se incluye el Dockerfile necesario para generar una imagen Docker para ser montada en cualquier servicio. Esta imagen puede ser utilizada en entornos locales o remotos.

### Variables de entorno

- VUE_APP_SERVER_URL: La URL del servidor KeystoneJS del cual se obtendrán todos los datos para el funcionamiento de la WebApp. Por ejemplo, `http://localhost:4000` en un entorno de desarrollo local o la URL del servicio de hosting correspondiente en caso de tratarse de un entorno remoto.
- PORT: El puerto donde se mostrará el frontend. Por ejemplo: `8080`.

### Pasos a seguir para ejecutar localmente

1. Realizar los pasos para la creación de un entorno local del backend en el [repo correspondiente](https://github.com/Poseidon-CMMS/Poseidon-CMMS/).
2. Clonar el repositorio.
3. Crear un archivo `.env` en la raíz y setear las variables de entorno mencionadas anteriormente.
4. Generar la imagen Docker con el comando `docker build . -t poseidon-cmms-app`.
5. Inicializar un container con la imagen utilizando el comando `docker run --env-file ./.env -p 8080:8080 poseidon-cmms-app`. Nota: si se elige cambiar la variable de entorno PORT, ajustar este comando con el nuevo puerto elegido.
6. Para acceder a la WebApp, acceder desde un navegador a `localhost:8080`.

### Pasos a seguir para ejecutar en un servicio de hosting de containers

1. Crear un servicio Web utilizando este repo según las instrucciones del proveedor.
2. Establecer las variables de entorno con sus valores correspondientes. Asegurarse de establecer la variable `VUE_APP_SERVER_URL` con la URL obtenida al ejecutar el backend KeystoneJS en su servicio de hosting.
