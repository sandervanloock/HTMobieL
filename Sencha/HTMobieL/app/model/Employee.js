Ext.define('Expense.model.Employee', {
	extend : 'Ext.data.Model',
	alias : 'model.employee',

	config : {
		fields : [ {
			name : 'id',
			type : 'int'
		}, {
			name : 'firstName',
			type : 'string'
		}, {
			name : 'lastName',
			type : 'string'
		}, {
			name : 'employeeNumber',
			type : 'string'
		}, {
			name : 'unitId',
			type : 'string'
		}, {
			name : 'email',
			type : 'string'
		}, {
			name : 'password',
			type : 'string'
		} ],
		/*hasMany : {
			associatedModel : 'Expense.model.Expense',
			name : 'expenses'
		},*/
		validations : [ {
			type : 'presence',
			field : 'employeeNumber'
		}, {
			type : 'email',
			field : 'email'
		}, {
			type : 'presence',
			field : 'unit'
		} ]
	}
});