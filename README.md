# TAN - Seminario Integrador

## Estructuracion del Proyecto

TAN - Seminario Integrador/
└── backend/
    └── src/
        └── main/
          └── java/
              └── com/
                  └── tan/
                    └── seminario/
                        └── backend/
                            ├── CasosDeUsos/ # Contiene la lógica de casos de uso del sistema separados por Modulos
                                ├── Finanzas
                                ├── Inmubles
                                ├── Seguridad
                                └── Reservas
                            ├── Controllers/ # Define los controladores REST para la API
                            ├── Entidades/ # Modelos o entidades del dominio
                            ├── Repository/ # Interfaces para la persistencia de datos
                            └── TanBackendApplication.java # Clase principal que inicia la aplicación Spring Boot
                        └── config/
                            └── SeguridadConfig.java
                        
## Tecnologías utilizadas

- Java 17
- Spring Boot
- Maven / Gradle
- JPA / Hibernate
- PostgreSQL
