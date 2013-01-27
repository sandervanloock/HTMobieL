Ext.define('Expense.controller.CurrencyController', {
    extend: 'Ext.app.Controller',
    alias: 'controller.currencycontroller',

    config: {
        refs: {
			abroadExpense: 'abroadexpense'
        },
        control: {
           '#abroadexpense':{
        	   initialize: 'loadCurrencies'
           }
        }
    },
    
    loadCurrencies: function(comp, eOpts){
    	Ext.getStore('currencystore').load();
    }
});