Ext.define('Expense.view.Page', {
    extend: 'Ext.Container',
    alias: 'widget.page',

    requires: [
        'Expense.view.InfoPanel',
        'Expense.view.Overview',
        'Expense.view.AddExpenseContainer',
        'Expense.view.SignField'
    ],

    config: {
        id: 'page',
        layout: {
            type: 'card'
        },
        items: [
            {
                xtype: 'infopanel'
            },
            {
                xtype: 'overview'
            },
            {
                xtype: 'addexpensecontainer'
            },
            {
                xtype: 'signfield'
            }
        ]
    }

});