# Sistema de Gestión - Base de Datos MySQL/MariaDB

Este proyecto contiene la estructura base de una base de datos llamada `sistema`, que incluye autenticación por roles y un usuario administrador por defecto.

---

## 🧰 Requisitos

- MariaDB o MySQL instalado
- Cliente para ejecutar scripts SQL (MySQL Workbench, DBeaver, phpMyAdmin, etc.)
- Node.js (solo si necesitas regenerar hashes de contraseñas con bcrypt)

---

## 📁 Estructura de la base de datos

Se crean dos tablas principales:

- `roles`: define los distintos tipos de usuario.
- `usuarios`: contiene los datos de cada usuario, incluyendo el campo `rol_id` que referencia a `roles`.

---

## 📦 Script SQL de creación

```sql
CREATE DATABASE IF NOT EXISTS sistema
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;

USE sistema;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO roles (id, nombre) VALUES
(1, 'admin'),
(2, 'user');

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    email VARCHAR(150),
    telefono VARCHAR(20),
    cedula VARCHAR(50),
    password VARCHAR(255),
    password_temp TINYINT DEFAULT 1,
    rol_id INT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuarios_roles FOREIGN KEY (rol_id) REFERENCES roles(id)
) ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;

-- Insertar usuario administrador por defecto
INSERT INTO usuarios (
    nombre,
    apellido,
    email,
    telefono,
    cedula,
    password,
    password_temp,
    rol_id
) VALUES (
    'Admin',
    'Principal',
    'admin@sistema.com',
    '0000000000',
    '000000000',
    '$2a$10$9nW.6yp6Jgn..LiGkRsWXOMjiwUJBY1nmkQyv5BmRi9FtIb80ovv.',  -- password: 81fbb383 
    0,
    1
);
