Ext.define('Expense.view.Menu', {
    extend: 'Ext.Panel',
    alias: 'widget.menuPanel',

    config: {
        cls: 'menu-background',
        id: 'menupanel',
        items: [
            {
                xtype: 'list',
                id: 'menulist',
                itemId: 'menulist',
                html: '<h1 class=\'x-custom-title\'>New Expense</h1>',
                ui: 'round',
                scrollable: false,
                data: [
                    {
                        item: 'Your Info'
                    },
                    {
                        item: 'Overview'
                    },
                    {
                        item: 'Add Expense'
                    },
                    {
                        item: 'Sign & Send'
                    }
                ],
                itemTpl: [
                    '{item}'
                ]
            }
        ]
    }

});