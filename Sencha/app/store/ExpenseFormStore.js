
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
            headers: {
                //headers zetten zodat xml wordt teruggegeven,  niet JSON
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
            },
            reader: {
                type: 'xml',
                record: 'expenseForm'
            }
        },
        sorters: {
            property: 'date',
            direction: 'DESC'
        }
    }
});