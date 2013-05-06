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
            url: 'http://kulcapexpenseapp.appspot.com/resources/currencyService/getCurrencies',
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