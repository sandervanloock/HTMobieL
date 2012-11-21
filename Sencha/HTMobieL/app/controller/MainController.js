Ext.define('Expense.controller.MainController',{
	extend: 'Ext.app.Controller',

	config: {
       control: {
            '#logout': {
                tap: 'doLogout'
            }
        }
	
    },
    
    doLogout: function(button, e, options){
    	console.log('logout');
    	Expense.app.token = '';
    	Ext.getStore('employeestore').removeAll();
    	console.log(Ext.getStore('employeestore').getCount());
    	Ext.Viewport.setActiveItem(Ext.getCmp('loginpanel'));
    },
    
    showExpenseOverview: function(button, e, options){
    	Ext.Ajax.request({
    		url: 'http://localhost:8888/resources/expenseService/getExpenseForms',
    		method: 'POST',
    		useDefaultXhrHeader: false,
    		params:{
    			token: Expense.app.token
    		},
    		callback : function(options, success, response) {
    			console.log("overview callback");
    		}
    	});
    }
});