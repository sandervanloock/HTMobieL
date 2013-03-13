var ExpenseForm = kendo.data.Model.define( {
    id: "expenseFormId",
    fields : {
        "date": {
            type: 'date'
        },
        "statusId": {
            type: 'int'
        },
        "signature": {
            type: 'string'
        },
        "remarks": {
            type : 'string'
        },
        "notification": {
            type: 'boolean'
        }
    }
});

