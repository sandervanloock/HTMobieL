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
            type: 'localstorage'
        },
        sorters: {
            property: 'date'
        }
    }
});