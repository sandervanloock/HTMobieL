
Ext.define('Expense.store.EmployeeStore', {
    extend: 'Ext.data.Store',
    alias: 'store.employeestore',

    requires: [
        'Expense.model.Employee'
    ],

    config: {
        model: 'Expense.model.Employee',
        storeId: 'employeestore',
        listeners: {
           load: 'initApplication',
           updaterecord: 'initApplication',
           addrecords: 'initApplication'
        },
        proxy: {
            type: 'ajax',
            url: Expense.app.getBaseURL() + '/resources/userService/getEmployee',
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
    },
    
	 initApplication : function(comp, records, successful, operation, eOpts ){
		 	var employeeStore = comp;
			var employee = employeeStore.getAt(0);
			Expense.app.setEmployee(employee);
		    
		    Ext.getCmp('introtext').setHtml('Hello, ' + employee.get('firstName') + '<br> I want to: <br>');
			
			var infopanel = Ext.getCmp('infopanel');
			infopanel.setRecord(employee); 
			var today = new Date();
			if(today.getUTCDate() < 14)
				infopanel.getComponent('infofield').getComponent('month').setValue((today.getUTCMonth()) % 13);
			else
				infopanel.getComponent('infofield').getComponent('month').setValue((today.getUTCMonth()+1) % 13);
			infopanel.getComponent('infofield').getComponent('year').setValue('7'); //TODO welk jaar invullen en waarop gebaseerd?
			
			Ext.Viewport.setActiveItem(Ext.getCmp('home'));
			
			var expenseStore = Ext.getStore('expensestore');
			expenseStore.getProxy().setExtraParams({
				token: Expense.app.getToken()
			});
			expenseStore.load();
	 }
   
});

