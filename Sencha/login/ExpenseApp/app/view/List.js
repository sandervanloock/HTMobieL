var start;
var stop;

Ext.define('ExpenseApp.view.List', {
    extend: 'Ext.dataview.List',

    requires: [
        'Ext.TitleBar',
        'ExpenseApp.store.Songs'
    ],

    config: {
        fullscreen: true,
        store: 'Songs',
        itemTpl: '<div class="listelement"><img src="resources/images/boston.jpg">{id}: Title - Artist</div>',
        onItemDisclosure: true,
        items: [
            {
                xtype: 'titlebar',
                title: 'Expense App',
                docked: 'top'
            }
        ],
        listeners: {
            initialize: function () {
                var store = Ext.getStore('Songs');
                for (var i = 1; i <= 850; i++) {
                    store.add({id: i});
                }
            }
        }

    }
});