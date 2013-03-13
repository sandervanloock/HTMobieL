var Expense = kendo.data.Model.define( {
    id: "expenseId",
    fields :
    {
        "expenseTypeId":{
            type : 'number'
        },
        "expenseLocationId": {
            type : 'number'
        },
        "date" :{
            type : 'date'
        },
        "projectCode": {
            type : 'string'
        },
        "currency": {
            type : 'string'
        },
        "amount": {
            type : 'number'
        },
        "remarks": {
            type : 'string'
        },
        "evidence" : {
            type: 'string'
        }
    }
});


