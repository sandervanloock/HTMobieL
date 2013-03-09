Ext.define('Expense.view.Menu', {
    extend: 'Ext.Panel',
    alias: 'widget.menuPanel',

    config: {
        id: 'menupanel',
        items: [
            {
                html: '<h1 class=\'x-custom-title\'>New Expense</h1>'
            },
            {
                xtype: 'list',
                id: 'menulist',
                itemId: 'menulist',
                ui: 'round',
                height: '100%',
                store: 'menustore',
                itemTpl: '{item}'
                /*data: [
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
                ]*/
            }
        ]
    }

});