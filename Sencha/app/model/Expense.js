Ext.define('Expense.model.Expense', {
	extend : 'Ext.data.Model',
	alias : 'model.expense',

	config : {
		fields : [{
            name: 'id',
            persist: false
        },
        {
			name : 'expenseType',
			convert : typeId,
			//mapping : 'expenseTypeId',
			type : 'string'
		}, {
			name : 'expenseLocation',
			convert : locationId,
			//mapping : 'expenseLocationId',
			type : 'string'
		}, {
			name : 'date',
			type : 'date'
		}, {
			name : 'projectCode',
			type : 'string'
		}, {
			name : 'currency',
			type : 'string'
		}, {
			name : 'amount',
			type : 'float'
		}, {
			name : 'remarks',
			type : 'string'
		},{
            name: 'evidence',
            type: 'string'
        },{
            name: 'encoded',
            type: 'boolean',
            value: false,
            persist: false
        }],
		validations : [
        {
            type: 'presence',
            name: 'date',
            message: 'Date of Expense must be present'
        },
		{
			type : 'presence',
			name : 'projectCode',
            message: 'Project code must be present' //nodig voor custom validations
		}, {
			type : 'presence',
			name : 'amount', //valid amount
            message: 'An amount must be present' //nodig voor custom validations
		}, {
            type: 'format',
            field: 'amount',
            matcher: /^[+]?\d+([.]\d+)?$/,
            message: 'Amount must be a valid number'
        },/*{ TODO
            type: 'presence',
            name: 'evidence',
            message: 'Evidence must be uploaded'
        }, */{
            field : 'remarks',
            name :'remarks',
            type : 'custom',
            message : 'Remarks must be present if \'other\' is picked as expense type',
            validator : function(config, value, model) {
                if (model.get('expenseType')=="Other" && (Ext.isEmpty(value) || value == "")) {
                    return false;
                } else{
                    return true;
                }
            }
        }
		]
	}
});


function encodeCurrency(record) {
    if(record.get('encoded')!= true){
        var currencies = Ext.getStore('currencystore').queryBy(
                function(testRecord, id) {
                    return testRecord.get('currency') == record.get('currency');
                }).first();
        if (currencies == undefined)
            return record.get('amount');
        var newAmount = record.get('amount') / currencies.get('rate');
        newAmount = Math.round(newAmount*100)/100;
        record.set('amount', newAmount);
        record.set('encoded', true);
    }
};

function decodeCurrency(record) {
    if(record.get('encoded')==true){
        var currencies = Ext.getStore('currencystore').queryBy(
            function(testRecord, id) {
                return testRecord.get('currency') == record.get('currency');
            }).first();
        if (currencies == undefined)
            return record.get('amount');
        var newAmount = record.get('amount') * currencies.get('rate');
        newAmount = Math.round(newAmount*100)/100;
        record.set('amount', newAmount);
        record.set('encoded', false);
    }
};

// HOTEL(1), LUNCH(2), DINER(3), TICKET(4), RESTAURANT(5), OTHER(6);
function typeId(v, record) {
	if (typeof (v) == 'string' && v.length>1)
		return v;
	switch (v) {
	case "1":
		return 'Hotel';
	case '2':
		return 'Lunch';
	case '3':
		return 'Diner';
	case '4':
		return 'Ticket';
	case '5':
		return 'Restaurant';
	case '6':
		return 'Other';
	default:
		return 'Unknown type';
	}
};

function typeId2(expense){
    switch (expense.expenseType) {
        case "Hotel":
            return 1;
        case 'Lunch':
            return 2;
        case 'Diner':
            return 3;
        case "Ticket" :
            return 4;
        case 'Restaurant':
            return 5;
        case 'Other':
            return 6;
        default:
            return 'Unknown type';
    }
};

// DOMESTIC(1), ABROAD(2);
function locationId(v, record) {
	if (typeof (v) == 'string' && v.length>1)
		return v;
	switch (v) {
	case '1':
		return 'Domestic';
	case '2':
		return 'Abroad';
	default:
		return 'Unknown type';
	}
};

// DOMESTIC(1), ABROAD(2);
function locationId2(expense) {
    switch (expense.expenseLocation) {
        case 'Domestic':
            return 1;
        case 'Abroad':
            return 2;
        default:
            return 'Unknown type';
    }
};