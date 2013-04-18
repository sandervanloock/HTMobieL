var Employee = kendo.data.Model.define( {
    fields: {
        "employeeId": {
            type:"number"
        },
        "firstName": {
            type: "string"
        },
        "lastName": {
            type: "string"
        },
        "employeeNumber": {
            type: "number",
            validation: {
                required: true
            }
        },
        "unitId": {
            type: "number",
            validation: {
                required: true
            }
        },
        "email": {
            type: "string",
            validation: {
                required: true
            }
        },
        "password": {
            type: "string"
        }
    }
});


var employee = new Employee();

var employeeLocalStorage = new kendo.data.DataSource({
    transport: {
        read: function(options) {
            if(EA.hasUser())
                employee = EA.getUser();
            else
                employee = new Employee();
            options.success(employee);
        }
    },
    schema: {
        model: Employee
    }
});