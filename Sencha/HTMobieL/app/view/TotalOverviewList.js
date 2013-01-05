
Ext.define('Expense.view.TotalOverviewList', {
    extend: 'Ext.dataview.List',
    alias: 'widget.totaloverviewlist',

    config: {
        ui: 'round',
        id: 'totaloverviewlist',
        store: 'expenseformstore',
        onItemDisclosure: true,
        items: [{
            xtype: 'toolbar',
            docked: 'top',
            id: 'toolbar',
            ui: 'light',
            title: 'Expense App',
            items: [
                {
                    xtype: 'button',
                    docked: 'right',
                    ui: 'confirm-round',
                    iconCls: 'action',
                    iconMask: true,
                    text: 'Home',
                    action: 'home'
                }
            ]
        }],
        itemTpl: [
            '<div>{date:date("d/m/Y")} &mdash; <small> {id} </small></div>'
        ]
    }

});

