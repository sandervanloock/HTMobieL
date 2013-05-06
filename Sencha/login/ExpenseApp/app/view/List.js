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
        itemTpl: '<img src="resources/images/boston.jpg" width="25" heigh="25"><span>{id}: Title - Artist</span>',
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
                console.log("initialize");
                //initialize: function () {
                //this.callParent(arguments);
                start = new Date();
                var store = Ext.getStore('Songs');
                for (var i = 1; i <= 1000; i++) {
                    store.add({id: i});
                }
            },
            painted: function () {
                console.log("painted");
                stop = new Date();
                alert("Timer", stop - start);
            }
        }

    }
});