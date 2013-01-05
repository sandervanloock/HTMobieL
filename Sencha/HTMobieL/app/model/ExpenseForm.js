Ext.define('Expense.model.ExpenseForm', {
	extend : 'Ext.data.Model',
	alias : 'model.expenseform',

	config : {
		fields : [ {
			name : 'id',
			type: 'int'
		},{
			name: 'date',
			type: 'date'
		},{
			name: 'notification',
			type: 'boolean'
		},{
			name : 'remarks',
			type : 'string'
		} ,{
			name: 'signature',
			type: 'string'
		}, {
			name: 'statusId',
			type: 'int'
		}, { 
			name: 'expenses',
			type: 'array' 
		} ],
		hasMany : {
			model : 'Expense.model.Expense',
			name : 'expenses'
		}
	}
});