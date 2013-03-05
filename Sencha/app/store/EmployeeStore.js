
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
           load: 'initApplication'
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
			var employee = comp.getAt(0);
            Expense.app.setEmployee(employee);
            Ext.getCmp('introtext').setHtml('<h2>Welcome, ' + employee.get('firstName') + '<br> I want to: <br></h2>');
            initializeInfoPanel(employee);
            Ext.Viewport.setActiveItem(Ext.getCmp('home'));
            var expenseStore = Ext.getStore('expensestore');
            expenseStore.load();

            //sync with localstorage
            //IDEAS found at http://lalexgraham.wordpress.com/2012/09/12/sencha-touch-2-example-of-syncing-localstorage-store-with-remote-jsonp-proxy-store/
            var localemployeestore = Ext.getStore('localemployeestore');
            localemployeestore.add(employee.copy());
            localemployeestore.sync();
	 }
   
});

Number.prototype.mod = function(n) {
	return ((this%n)+n)%n;
};

initializeInfoPanel = function(employee){
    Expense.app.setExpenseForm(Ext.create('Expense.model.ExpenseForm'));
	var infopanel = Ext.getCmp('infopanel');
	infopanel.setRecord(employee); 
	var today = new Date();

	infopanel.getComponent('infofield').getComponent('year').setOptions(
			[{text: today.getFullYear()-1, value: today.getFullYear()-1},
			 {text: today.getFullYear(), value: today.getFullYear()},
			 {text: today.getFullYear()+1, value: today.getFullYear()+1}]);
	if(today.getUTCDate() > 14){
		infopanel.getComponent('infofield').getComponent('month').setValue(today.getUTCMonth().mod(12)+'');
		infopanel.getComponent('infofield').getComponent('year').setValue(today.getFullYear());
	}
	else{ //zet vorige maand
		infopanel.getComponent('infofield').getComponent('month').setValue((today.getUTCMonth()-1).mod(12)+'');
		if(infopanel.getComponent('infofield').getComponent('month').getValue() == '11')
			infopanel.getComponent('infofield').getComponent('year').setValue(today.getFullYear()-1);
		else //zet vorig jaar
			infopanel.getComponent('infofield').getComponent('year').setValue(today.getFullYear());
	}
};

