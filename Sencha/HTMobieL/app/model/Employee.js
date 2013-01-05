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
		validations : [ {
			type : 'presence',
			field : 'employeeNumber'
		}, {
			type : 'presence',
			field : 'email'
		}, {
			type : 'email',
			field : 'email'
		}, {
			type : 'presence',
			field : 'unitId'
		} ]
	}
});