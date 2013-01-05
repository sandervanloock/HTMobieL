
Ext.define('Expense.controller.ExpenseController', {
    extend: 'Ext.app.Controller',
    alias: 'controller.expensecontroller',

    config: {
        refs: {
            nav: 'overview'
        },

        control: {
            "#overviewlist": {
                disclose: 'showDetailExpense'
            },
            "#totaloverviewlist": {
            	disclose: 'showExpensePDF'
            }
        }
    },

    showDetailExpense: function(list, record, target, index, e, options) {
    	if(record.getData()['expenseLocation'] == 'Abroad'){
	        this.getNav().push({
	            xtype: 'abroadexpensedetail',
	            record: record
	        });
    	} else {
    		this.getNav().push({
	            xtype: 'domesticexpensedetail',
	            record: record
	        });
    	}
    },
    
    showExpensePDF: function(list, record, target, index, e, options) {
    	console.log(Ext.getStore('expensestore').getCount());
    	console.log(Ext.getStore('expenseformstore').getCount());
    	console.log(record);
    	//if(Ext.device.Connection.isOnline()){
		 Ext.Viewport.setActiveItem(Ext.create('Ext.ux.panel.PDF',{
	            fullscreen: true,
	            layout    : 'fit',
	            src       : Expense.app.getBaseURL() + '/resources/expenseService/getExpenseFormPDF', // URL to the PDF - Same Domain or Server with CORS Support
	            extraParams: 'token='+Expense.app.getToken()+'&expenseFormId='+record.get('id') //TODO expenseFormId
	        }));
    	//}
    }

});