Ext.define('Expense.view.Viewport', {
    extend: 'Ext.Container',
    alias: 'widget.viewport',
    xtype: 'viewport',
    

    requires: [
        'Expense.view.Menu',
        'Expense.view.Page'
    ],

    config: {
        fullscreen: true,
        id: 'viewport',
        layout: {
            pack: 'center',
            type: 'hbox'
        },
        items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'Expense App',
                items: [
                    {
                        xtype: 'button',
                        align: 'left',
                        id: 'menuButton',
                        iconCls: 'settings',
                        iconMask: true,
                        text: 'Menu',
                        action: 'menu',
                        hidden: true
                    },
                    {
                        xtype: 'button',
                        align: 'right',
                        ui: 'action',
                        iconCls: 'home',
                        iconMask: true,
                        text: 'Home',
                        action: 'home'
                    }
                ]
            },
            {
                xtype: 'menuPanel',
                flex: 1
            },
            {
                xtype: 'page',
                flex: 3
            }
        ]
    }

});