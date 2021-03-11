const connection = require("./db/connection");
const mysql = require("mysql");
const inquirer = require("inquirer");

var roleArr = [];
var managerArr = [];

const run = () => {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "View Employees by Department",
        "View Employees by Role",
        "Add Employee",
        "Add Role",
        "Add Department",
        "Update Employee",
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case "View All Employees":
          viewAll();
          break;

        case "View All Employees by Department":
          viewByDept();
          break;

        case "View All Employees by Roles":
          viewByRole();
          break;

        case "Add Employee":
          addEmployee();
          break;

        case "Add Department":
          addDept();
          break;

        case "Add Role":
          addRole();
          break;

        case "Update Employee":
          update();
          break;

        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const viewAll = () => {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
    (err, res) => {
      if (err) throw err;
      run();
    }
  );
};

const viewByDept = () => {
  connection.query(
    "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
    (err, res) => {
      if (err) throw err;
      run();
    }
  );
};

const viewByRole = () => {
  connection.query(
    "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
    (err, res) => {
      if (err) throw err;
      run();
    }
  );
};

const addEmployee = () => {
    inquirer
      .prompt([
        {
          name: "firstname",
          type: "input",
          message: "What is the employee's first name?",
        },
        {
          name: "lastname",
          type: "input",
          message: "What is the employee's last name?",
        },
        {
          name: "role",
          type: "list",
          message: "What is the employee's role?",
          choices: selectRole(),
        },
        {
          name: "choice",
          type: "rawlist",
          message: "Whats the employee's managers name?",
          choices: selectManager(),
        },
      ])
      .then((val) => {
        var roleId = selectRole().indexOf(val.role) + 1;
        var managerId = selectManager().indexOf(val.choice) + 1;
        connection.query(
          "INSERT INTO employee SET ?",
          {
            first_name: val.firstName,
            last_name: val.lastName,
            manager_id: managerId,
            role_id: roleId,
          },
           (err) => {
            if (err) throw err;
            run();
          }
        );
      });
};

const addDept = () => {
    inquirer
      .prompt([
        {
          name: "name",
          type: "input",
          message: "What is the name of the department you would like to add?",
        },
      ])
      .then((res) => {
        let query = connection.query(
          "INSERT INTO department SET ? ",
          {
            name: res.name,
          },
        (err) => {
            if (err) throw err;
            run();
          }
        );
      });
};

const addRole = () => {
    connection.query(
      "SELECT role.title AS Title, role.salary AS Salary FROM role",
       (err, res) => {
        inquirer
          .prompt([
            {
              name: "Title",
              type: "input",
              message: "What is the roles Title?",
            },
            {
              name: "Salary",
              type: "input",
              message: "What is the Salary?",
            },
          ])
          .then((res) => {
            connection.query(
              "INSERT INTO role SET ?",
              {
                title: res.Title,
                salary: res.Salary,
              },
                (err) => {
                if (err) throw err;
                run();
              }
            );
          });
      }
    );
};

const update = () => {
    connection.query(
      "SELECT employee.last_name, role.title FROM employee JOIN role ON employee.role_id = role.id;",
      (err, res) => {
        if (err) throw err;
        console.log(res);
        inquirer
          .prompt([
            {
              name: "lastName",
              type: "rawlist",
              choices: () => {
                var lastName = [];
                for (var i = 0; i < res.length; i++) {
                  lastName.push(res[i].last_name);
                }
                return lastName;
              },
              message: "What is the Employee's last name? ",
            },
            {
              name: "role",
              type: "rawlist",
              message: "What is the Employees new title? ",
              choices: selectRole(),
            },
          ])
          .then((val) => {
            var roleId = selectRole().indexOf(val.role) + 1;
            connection.query(
              "UPDATE employee SET WHERE ?",
              {
                last_name: val.lastName,
              },
              {
                role_id: roleId,
              },
              function (err) {
                if (err) throw err;
                run();
              }
            );
          });
      }
    );
};

const selectRole = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      roleArr.push(res[i].title);
    }
  });
  return roleArr;
};

const selectManager = () => {
  connection.query(
    "SELECT first_name, last_name FROM employee WHERE manager_id IS NULL",
    (err, res) => {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        managerArr.push(res[i].first_name);
      }
    }
  );
  return managerArr;
};

run();
