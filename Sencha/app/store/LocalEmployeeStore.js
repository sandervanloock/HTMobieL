Ext.define('Expense.store.LocalEmployeeStore', {
    extend: 'Ext.data.Store',
    alias: 'store.localemployeestore',
    id: 'localemployeestore',

    requires: [
        'Expense.model.Employee'
    ],

    config: {
        model: 'Expense.model.Employee',
        storeId: 'localemployeestore',
        autoLoad: false,
        listeners: {
            load: 'initApplication'
        },
        proxy: {
            type: 'localstorage'
        }
    },

    initApplication : function(comp, records, successful, operation, eOpts ){
        var employee = comp.getAt(0);
        if(employee != undefined){
            Expense.app.setEmployee(employee);
            Ext.create('Expense.view.Home', {fullscreen: true});
            Ext.create('Expense.view.Viewport', {fullscreen: true});
            Ext.create('Expense.view.TotalOverviewList',{fullscreen: true});

            Ext.getCmp('introtext').setHtml('<h2>Welcome, ' + employee.get('firstName') + '<br> I want to: <br></h2>');
            initializeInfoPanel(employee);
            Ext.Viewport.setActiveItem(Ext.getCmp('home'));

            var expenseStore = Ext.getStore('expensestore');
            expenseStore.load();
        }
    }

});