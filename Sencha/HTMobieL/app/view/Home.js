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
			centered : true,
			items : [ {
				xtype : 'panel',
				id : 'introtext'
			}, {
				xtype : 'button',
				height : 46,
				ui : 'action-round',
				width : 212,
				iconAlign : 'center',
				text : 'Create New Expense',
				action : 'newExpense'
			}, {
				xtype : 'button',
				height : 46,
				ui : 'action-round',
				width : 212,
				iconAlign : 'center',
				text : 'View My Expenses',
				action : 'totaloverviewlist'
			} ]
		} ]
	}

});