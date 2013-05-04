Ext.define('ExpenseApp.view.List', {
    extend: 'Ext.List',

    requires: [
        'ExpenseApp.store.Songs'
    ],

    config: {
        fullscreen: true,
        store: 'Songs',
        itemTpl: '{id}: Title - Artist',
        onItemDisclosure: true
    }
});