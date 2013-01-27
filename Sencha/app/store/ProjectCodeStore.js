Ext.define('Expense.store.ProjectCodeStore', {
    extend: 'Ext.data.Store',
    alias: 'store.projectcodestore',

    requires: [
        
    ],

    config: {
        fields: [
               {
                   name: 'data',
                   convert: function(values, record) {
                       if(values==null)
                        return null;
                       var data = [],
                           ln = values.length,
                           i, name;

                       // loop through each of the array values
                       for (i = 0; i < ln; i++) {
                               name = values[i];
                               data.push({
                                   name: name
                               });
                       }

                       // return the data array for this field
                       return data;
                   }

               }
        ],
        storeId: 'projectcodestore',
        proxy: {
            type: 'ajax',
            url: Expense.app.getBaseURL() + '/resources/expenseService/getProjectCodeSuggestion',
            actionMethods: {
                create : 'POST',
                read   : 'POST',
                update : 'POST',
                destroy: 'POST'
            },
            reader: {
                type: 'json'
            }
        }
    }
});