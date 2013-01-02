
Ext.define('Expense.store.ExpenseStore', {
    extend: 'Ext.data.Store',
    alias: 'store.expensestore',
    id: 'expensestore',

    requires: [
        'Expense.model.Expense'
    ],

    config: {
    	autoLoad: false,
        model: 'Expense.model.Expense',
        storeId: 'expensestore',
        proxy: {
            type: 'ajax',
            url: Expense.app.getBaseURL() + '/resources/expenseService/getExpenseForms',
            actionMethods: {
                create : 'POST',
                read   : 'POST',
                update : 'POST',
                destroy: 'POST'
            },
            reader: {
                type: 'xml',
                id: 'expensereader',
                record :'expenses',
                model: 'Expense.model.Expense',
                totalProperty: 'statusId'
            }
        },
        sorters: {
            property: 'date'
        }
    }
});