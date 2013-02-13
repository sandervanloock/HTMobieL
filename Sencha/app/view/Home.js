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
                type: 'vbox'
            },
            centered: true,
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
                margin: '20 20 20 20'
			}, {
				xtype : 'button',
				height : 46,
				ui : 'action-round',
				width : 212,
				iconAlign : 'center',
				text : 'View My Expenses',
				action : 'totaloverviewlist',
                margin: '0 20 20 20'
			} ]
		} ]
	}

});