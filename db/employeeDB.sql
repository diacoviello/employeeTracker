DROP DATABASE IF EXISTS employeeDB;
CREATE DATABASE employeeDB;

USE employeeDB;

CREATE TABLE department (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT UNSIGNED NOT NULL,
    INDEX dep_id (department_id),
    -- foreign key references cascade
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    INDEX role_id (role_id),
    -- foreign key references cascade
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INT UNSIGNED,
    INDEX man_id (manager_id),
    -- foreign key references cascade
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
)

INSERT INTO department (name)
VALUE ("Legal");
INSERT INTO department (name)
VALUE ("Engineering");
INSERT INTO department (name)
VALUE ("Finance");
INSERT INTO department (name)
VALUE ("Sales");

INSERT INTO role (title, salary, department_id)
VALUE ("Lead Engineer", 100000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Legal Team Lead", 250000, 1);
INSERT INTO role (title, salary, department_id)
VALUE ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUE ("Sales Lead", 100000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Salesperson", 80000, 4);
INSERT INTO role (title, salary, department_id)
VALUE ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUE ("Lawyer", 190000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Elliot", "Stabler", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Marisa", "Smith", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Jeffrey", "Goldblum", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Annmarie", "Schrader", 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Fred", "Flinstone", 5, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Barney", "Rubble", 6, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Patrick", "Star", 7, 4);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;