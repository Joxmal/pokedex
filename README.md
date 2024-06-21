<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar

```
npm install
```
3. Tener Nest CLI instalado
```
npm i  -g @nestjs/cli
```

4. reconstruir la base de datos con la semilla
```
  http://localhost:3000/api/v2/seed
```

# Preoduction Build
1. Crear el archivo .env.prod
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

