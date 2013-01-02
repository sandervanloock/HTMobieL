Ext.define('Expense.store.ProjectCodeStore', {
    extend: 'Ext.data.Store',
    alias: 'store.projectcodestore',

    requires: [
        
    ],

    config: {
        fields: [
               {name: 'id', type: 'string'}
        ],
        storeId: 'projectcodestore',
        proxy: {
            type: 'ajax',
            url: Expense.app.getBaseURL() + '/resources/expenseService/getProjectCodeSuggestion', //TODO url
            extraParams:{
            	keyword: ''
            },
            actionMethods: {
                create : 'POST',
                read   : 'POST',
                update : 'POST',
                destroy: 'POST'
            },
            reader: {
                type: 'xml',
                rootProperty: 'data'
            }
        }
    }
});