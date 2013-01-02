
Ext.define('Expense.store.CurrencyStore', {
    extend: 'Ext.data.Store',
    alias: 'store.currencystore',


    config: {
    	fields: [
                 {name: 'currency', type: 'string', mapping: '@currency'},
                 {name: 'rate', type: 'float', mapping: '@rate'}
        ],
        storeId: 'currencystore',
        filters : [
              {
            	  filterFn: function(item) 
            	  {
                	   return item.get('currency') != null && item.get('rate') != null;
              	  }
              }
        ],
        proxy: {
            type: 'ajax',
            url: Expense.app.getBaseURL() + '/resources/currencyService/getCurrencies', //TODO url
            actionMethods: {
                create : 'POST',
                read   : 'POST',
                update : 'POST',
                destroy: 'POST'
            },
            reader: {
                type: 'xml',
                record: 'Cube'
            }
        }
    }
});