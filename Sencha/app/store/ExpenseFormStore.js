
Ext.define('Expense.store.ExpenseFormStore', {
    extend: 'Ext.data.Store',
    alias: 'store.expenseformstore',

    requires: [
        'Expense.model.ExpenseForm'
    ],

    config: {
    	autoLoad: false,
        model: 'Expense.model.ExpenseForm',
        storeId: 'expenseformstore',
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
                type: 'json',
                record: 'expenseForm',
                idProperty: 'id'
            }
        },
        sorters: {
            property: 'date'
        }
    }
});