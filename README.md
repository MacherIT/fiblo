### Requerimientos

- **NodeJS**: Tecnología base del servidor (https://nodejs.org/es/)
- **PostgreSQL**: Motor de base de datos (https://www.postgresql.org/)
- **Truffle**: Conjunto de herramientas de migración y compilación de contratos (https://truffleframework.com/)
- **Ganache**: Herramienta que genera un nodo RPC que 'simula' el funcionamiento de la red Ethereum (https://truffleframework.com/ganache)
- **MetaMask**: Extensión de navegador para conexión con red de Ethereum (https://metamask.io/)

### Consideraciones

- Partimos de la base que el sistema operativo que se está utilizando es Ubuntu 16.04 - 64 bits
- Vamos a suponer que el usuario que está realizando la instalación es un usuario de sistema de nombre 'john'
- En todas las instrucciones, todas las lineas que comiencen con el símbolo '#' son un 'comentario', no una instrucción.
- Para todos los pasos de configuración e instalación se debe usar la terminal.
- Para comenzar, abrir una terminal y moverse al directorio principal del usuario
  ```
  cd /home/john
  ```

### Preparación del entorno

#### Herramientas básicas necesarias

- Ejecutar:
  ```
  sudo apt-get update
  sudo apt-get install build-essential
  sudo apt-get install curl
  sudo apt-get install git
  ```

#### NodeJS

1. Instalación
  ```
  curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```
2. Verificar la instalación
  ```
  node -v
  # Debería mostrarse algo como: v10.15.3
  npm -v
  # Debería mostrarse algo como: 6.4.1
  ```

#### PostgreSQL

1. Instalación
  ```
  sudo apt-get update
  sudo apt-get install postgresql postgresql-contrib
  ```
2. Verificar la instalación
  ```
  psql --version
  # Debería mostrarse algo como: psql (PostgreSQL) 9.5.16
  ```

#### Truffle

1. Instalación
  ```
  sudo npm install -g truffle@4.1.14
  # Aclaración: La instalación puede arrojar errores, pero si el siguiente paso funciona correctamente, se pueden ignorar dichos errores
  ```
2. Verificar la instalación
  ```
  truffle version
  # Debería mostrarse algo como lo siguiente:
  # Truffle v4.1.14 (core: 4.1.14)
  # Solidity v0.4.24 (solc-js)
  ```

#### Ganache

1. Descarga
  ```
  wget https://github.com/trufflesuite/ganache/releases/download/v2.0.1/Ganache-2.0.1.AppImage
  chmod +x Ganache-2.0.1.AppImage
  ```
2. Verificar la instalación
  ```
  ./Ganache-2.0.1.AppImage
  # Debería aparecer un cartel preguntándonos si queremos añadir Ganache a nuestros 'lanzadores' (por conveniencia, recomendamos seleccionar 'Si')
  # Debería aparecer la interfaz de Ganache (si aparece un recuadro blanco y nada más, cerrar la aplicación y volverla a lanzar)
  # Nos preguntará si deseamos compartir metadata para análisis, apretamos en continuar
  # En la pantalla siguiente nos ofrecerá 2 opciones 'Quickstart' y 'Advanced', seleccionamos 'Quickstart' y deberíamos ver una lista de cuentas con su balance (100 ETH)
  ```

#### MetaMask

**Instalación y configuración**

1. Abrir el navegador (en nuestro caso, Firefox)
2. Ingresar en https://addons.mozilla.org/es/firefox/addon/ether-metamask/
3. Hacer click en el botón azul '+ Agregar a Firefox'
4. Aceptar la instalación en el popup
5. Una vez instalada nos llevará a una página con un botón que indica 'Get started', clickearlo
6. De las 2 opciones que se nos presentan, seleccionar la de la derecha 'Create a Wallet'
7. Hacer click en 'I agree'
8. Completar el formulario (guardar esa contraseña en un lugar seguro)
9. Hacer click en la imagen difuminada, la misma contiene un conjunto de 12 palabras que sirven para construir nuestra billetera, ES DE SUMA IMPORTANCIA que copiemos esas palabras en algún archivo en el ORDEN EXACTO en el que se muestran, ya que las mismas nos serán solicitadas en el siguiente paso
10. Hacer click en las palabras que se muestran en el mismo orden en el que estaban en el paso anterior.
11. Hacer click en el botón 'All done'
12. En la pantalla principal de MataMask seleccionar el desplegable que está arriba a la derecha (el mismo debería decir 'Main Ethereum Network'), del desplegable elegir la opción 'Custom RPC'
13. Dentro de la pantalla de configuración (settings), hacer scroll hasta la sección que enuncia 'New Network'
14. Dentro del desplegable escribir http://localhost:7545 y hacer click en el botón 'Save'

**Importación de cuenta/s**

1. Desde la aplicación Ganache, la pantalla principal muestra la lista de las cuentas generadas automáticamente, de la primera, hacer click en el ícono de la llave que aparece sobre la derecha.
2. Del popup que aparece, copiar (Ctrl-C) la cadena de texto que se muestra (llave privada) y hacer click en 'Done'
3. Desde la pantalla principal de MetaMask (o la pequeña interfaz que aparece al hacer click sobre el ícono de la extensión en la barra del navegador), hacer click sobre el círculo de colores (el ávatar de cuenta) y del menú que se despliega, seleccionar 'Import Account'.
4. Verificar que la opción seleccionada en 'Type' enuncia 'Private Key', pegar en el campo de texto la llave que habíamos copiado (Ctrl-V) y hacer click en 'Import'
5. Deberíamos ver que se actualiza el saldo de la cuenta activa y este coincide con el saldo mostrado dentro de Ganache

*(para importar más cuentas, repetir los pasos de importación seleccionando la llave privada de otra cuenta)*

### Preparación de PostgreSQL

1. Creación del usuario de base de datos
  ```
  sudo -u postgres createuser --interactive
  # Nos preguntará el nombre del usuario, indicamos el nombre de usuario que estamos utilizando (en este caso john)
  # Nos preguntará si el usuario tendra rol de super usuario, indicamos 'y'
  ```
2. Colocar la contraseña del usuario creado
  ```
  sudo -u postgres psql
  # Debería mostrarnos algo como lo siguiente:
  # psql (9.5.16)
  # Type «help» for help.
  # psql=#
  alter user <nombre-de-usuario> with encrypted password '<contraseña>'; (Ej: alter user john with encrypted password '12345')
  ```
3. Creación de la base de datos
  ```
  sudo -u postgres createdb fiblo
  ```
4. Verificación
  ```
  psql -d fiblo -U <nombre-de-usuario> (Ej: psql -d -U john)
  # Debería mostrarnos algo como lo siguiente:
  # psql (9.5.16)
  # Type «help» for help.
  # fiblo=#
  ```

### Instalación de Fiblo

1. Descargar el código fuente
  ```
  wget https://github.com/MacherIT/fiblo/archive/master.zip
  ```
2. Extraer el contenido del zip
  ```
  unzip master.zip
  ```
3. Moverse al directorio del proyecto
  ```
  cd fiblo-master
  ```
4. Instalar dependencias del proyecto
  ```
  npm install
  ```
5. Instalar nodemon
  ```
  sudo npm install -g nodemon
  ```
6. Configurar el archivo de entorno con nuestros datos
  ```
  nano nodemon.json
  # Respetando espacios y tabulaciones ajustar los datos de base de datos
  #
  # ...
  # "DB_NAME": "fiblo",
  # "DB_USERNAME": "john",
  # "DB_PASSWORD": "12345"
  # ...
  #
  # Para guardar el archivo y salir presionar Ctrl-O, luego Enter, luego Ctrl-X
  ```
7. Importar usuarios y categorías
  ```
  psql -d -U <nombre-de-usuario> -f SQL/creacion-usuarios.sql
  psql -d -U <nombre-de-usuario> -f SQL/creacion-categorias.sql
  ```

### Compilación y migración de los contratos base a la red de pruebas

- Este paso debe realizarse cada vez que se cierra el Ganache

1. Abrir el Ganache, desde el menu de aplicaciones o de la siguiente manera
  ```
  # Abrir una terminal
  cd /home/john
  ./Ganache-2.0.1.AppImage
  ```
2. Compilar y migrar contratos
  ```
  # Abrir otra terminal
  cd /home/john/fiblo-master
  truffle compile  
  truffle migrate  
  ```
3. Iniciar servidor web y servidor de base de datos
  - Se necesitan 2 terminales abiertas al mismo tiempo para correr ambos servidores
  - En una terminal
  ```
  cd /home/john/fiblo-master
  npm run dev # Inicia el servidor web
  ```
  - En la otra terminal
  ```
  cd /home/john/fiblo-master
  nodemon
  ```
4. Abrir el sitio en el navegador y acceder a http://localhost:8080


# Redes específicas

- En todas las redes públicas (que no sean Ganache) se debe incluir el parámetro 'from' en las transacciones.

## Redes públicas
- Utilizar web3.eth.getGasPrice() para estimar el precio del gas antes de enviar cualquier transacción.

## Ropsten
- En todas las transacciones se necesita incluir el gas y el gasPrice. 

## RSK