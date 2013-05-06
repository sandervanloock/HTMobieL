Ext.define('Expense.controller.CurrencyController', {
    extend: 'Ext.app.Controller',
    alias: 'controller.currencycontroller',

    config: {
        refs: {
			home: 'home'
        },
        control: {
           '#home':{
        	   show: 'loadCurrencies'
           }
        }
    },
    
    loadCurrencies: function(comp, eOpts){
    	Ext.getStore('currencystore').load();
    }
});