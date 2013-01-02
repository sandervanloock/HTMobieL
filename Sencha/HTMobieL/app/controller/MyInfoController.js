
Ext.define('Expense.controller.MyInfoController',{
	extend : 'Ext.app.Controller',
	
	config : {
		refs : {
			myinfo : 'infopanel'
		},
		control : {
			"formpanel" : {
				painted : 'onFormpanelShow'
			}
		}
	},
	
	onFormpanelShow : function(component, options) {
		var employeeStore = Ext.getStore('employeestore');
    	var employee = employeeStore.getAt(0);
		this.getMyinfo().setRecord(employee);
	}
});