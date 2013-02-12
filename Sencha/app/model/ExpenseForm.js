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
            convert: statusIdString,
            type: 'string'
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

//NEW(1), VERIFIED(2), APPROVED(3), PAIDOUT(4), DISAPPROVED(5);
function statusIdString(v, record){
    if (typeof (v) == 'string' && v.length>1)
        return v;
    switch (v) {
        case '1'    :
            return 'New';
        case '2':
            return 'Verified';
        case '3':
            return 'Approved';
        case '4':
            return 'Paidout';
        case '5':
            return 'Disapproved';
        default:
            return 'Unknown status';
    }
};