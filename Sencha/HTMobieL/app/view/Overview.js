Ext.define('Expense.view.Overview', {
    extend: 'Ext.navigation.View',
    alias: 'widget.overview',

    requires: [
        'Expense.view.OverviewList'
    ],

    config: {
        items: [
            {
                xtype: 'overviewlist'
            },{
	           	 xtype: 'toolbar',
	             docked: 'bottom',
	             id: 'toolbar',
	             items: [
	                 {
	                     xtype: 'button',
	                     docked: 'left',
	                     ui: 'action',
	                     iconCls: 'add',
	                     iconMask: true,
	                     text: 'Add Expense',
	                     action: 'addExpense'
	                 },{
	                	 xtype: 'button',
	                	 docked: 'right',
	                	 ui: 'action',
	                	 iconCls: 'arrow_right',
	                	 iconAlign: 'right',
	                	 iconMask: true,
	                	 text: 'Sign & Send',
	                	 action: 'sign'
	                 }
	             ]
            }
        ]
    }

});