Ext.define('Expense.model.Expense', {
	extend : 'Ext.data.Model',
	alias : 'model.expense',

	config : {
		fields : [ {
			name : 'id'
		}, /*{
			name : 'employee_id2',
			type : 'string',
			value:  "4"
		}	,*/ {
			name : 'expenseType',
			convert : typeId,
			mapping : 'expenseTypeId',
			type : 'string'
		}, {
			name : 'expenseLocation',
			convert : locationId,
			mapping : 'expenseLocationId',
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
			convert : currencyConvert,
			type : 'float'
		}, {
			name : 'remarks',
			type : 'string'
		}  ],
		/*belongsTo : {
			associatedModel : 'Expense.model.Employee'
		},*/
		validations : [
		// TODO if other => remarks
		{
			type : 'presence',
			name : 'projectCode'
		}, {
			type : 'presence',
			name : 'amount'
		} // TODO amount >0
		// TODO evidence uploaded
		]
	}
});

function currencyConvert(v, currentRecord) {
	var currencies = Ext.getStore('currencystore').queryBy(
			function(testRecord, id) {
				return testRecord.get('currency') == currentRecord
						.get('currency');
			}).first();
	if (currencies == undefined)
		return v;
	var newAmount = v / currencies.get('rate');
	return newAmount;
}

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
}

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
}