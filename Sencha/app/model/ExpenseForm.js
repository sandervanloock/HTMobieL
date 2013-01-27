Ext.define('Expense.model.ExpenseForm', {
	extend : 'Ext.data.Model',
	alias : 'model.expenseform',

	config : {
		fields : [ {
			name : 'id',
			type: 'int',
            defaultValue: Math.floor(Math.random()*100)
        },{
            name: 'date',
            type: 'date'
        },{
            name: 'statusId',
            type: 'int'
        }, {
            name : 'employeeId',
            type: 'int'
         },{
            name: 'signature',
            type: 'string'
        },{
            name : 'remarks',
            type : 'string'
        } ,{
			name: 'notification',
			type: 'boolean'
		}, {
            name: 'expenses'
        }],
        validations : [
            {
                type : 'presence',
                name : 'signature',
                message: 'A signature must be present' //nodig voor custom validations
            }
        ]
	}
});