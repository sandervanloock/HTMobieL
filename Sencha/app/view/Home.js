Ext.define('Expense.view.Home', {
	extend : 'Ext.Container',
	alias : 'widget.home',

	config : {
		id : 'home',
		items : [ {
			xtype : 'toolbar',
			docked : 'top',
			items : [ {
				xtype : 'button',
				docked : 'right',
				ui : 'confirm-round',
				iconCls : 'action',
				iconMask : true,
				text : 'Logout',
				action : 'logout'
			} ]
		}, {
			xtype : 'fieldset',
            layout: {
                type: 'vbox',
                align: 'middle'
            },
            items : [ {
				xtype : 'panel',
				id : 'introtext',
                style: 'margin: 20px 20px 20px 20px'
			}, {
				xtype : 'button',
				height : 46,
				ui : 'action-round',
				width : 212,
				iconAlign : 'center',
				text : 'Create New Expense',
				action : 'newExpenseForm',
                style: 'margin: 20px 20px 20px 20px'
			}, {
				xtype : 'button',
				height : 46,
				ui : 'action-round',
				width : 212,
				iconAlign : 'center',
				text : 'View My Expenses',
				action : 'totaloverviewlist',
                style: 'margin: 0 20px 200px 20px'
			} ]
		} ]
	}

});