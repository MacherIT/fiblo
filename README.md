# PARA CORRER
Para ejecutarlo localmente en development se necesita instalar _truffle_ y _ganache-cli_ (y sus millones de dependencias).

En una consola correr el _ganash_ (ex _testrpc_, emula red de Ethereum, no necesita minar, provee direcciones para jugar, etc.)
```
ganash-cli
```

En otra consola hay que compilar los contratos de Solidity y migrar:
```
truffle compile
truffle migrate
```

Instalamos los paquetes necesarios para el frontend:
```
npm install
```

Y corremos el _webpack dev server_:
```
npm run dev
```
