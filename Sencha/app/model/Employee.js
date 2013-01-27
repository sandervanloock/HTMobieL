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
			field : 'employeeNumber',
            message: 'Employee number must be present'
		}, {
			type : 'presence',
			field : 'email',
            message: 'Email must be present'
		}, {
			type : 'email',
			field : 'email',
            message: 'Email must be a valid email adres'
		}, {
			type : 'presence',
			field : 'unitId',
            message: 'Unit ID must be present'
		} ]
	}
});