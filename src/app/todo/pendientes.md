

DESARROLLO

1.- Los roles (visibilidad)
2.- Hacer el modulo de roles.

3.- Generar reportes de clientes y pagos En XLS y PDF.
4.- Hacer un procedimiento almacenado para cambiar el nombre a las zonas cuando se cree un nuevo registro
5.- Evitar que se modifiquen el numero de semanas en las tarifas mediante un bloqueo o un estatus que ya no permita hacer los cambios tengo que hacer una consulta a la tabla o balance o creditos.
6.- Hacer un trigger que actualice contratos ya no vigentes.
7.- Implementar los Guards para el cierre de sesion.

8.- Empezar con el guard y pulir los permisos de visualizacion
para esto tengo que definir el arbol de roles, tambien tengo que migrar el menu al backend.

***Ajustes de estetica, los digitos y las comas de las cantidades.
1 - Hacer un vs de tablequery en pagos vs mi tabla normal para ver cual es mas eficiente en filtros y busqueda.


CONFIGURACIÓN E IMPLEMENTACiÓN

1.-Montar el Front en donweb

MIGRACION BASE ROSA A POSTGRESQL








//Credenciales DB Proyecta

PORT = 3000

DB_USER = proyecta
DB_PASSWORD = Cundu4c4n2023.
DB =  proyecta_production
DB_HOST = 147.182.162.26

SECRETORPRIVATEKEY = 35T435M1CL4V353CR3T4_PR0YECTASF

//Credenciales DB Oscar Arias

DB_USER = proyecta
DB_PASSWORD = password
DB =  proyecta_test
DB_HOST = 143.198.163.11

