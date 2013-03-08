Ext.define('Expense.view.AddExpenseContainer', {
    extend: 'Ext.TabPanel',
    alias: 'widget.addexpensecontainer',

    requires: [
        'Expense.view.AbroadExpense',
        'Expense.view.DomesticExpense'
    ],

    config: {
        defaults: {
            styleHtmlContent: true
        },
        tabBarPosition: 'top',
        tabBar : {
            layout : {
                pack : 'center'
            }
        },
        items: [
            {
                xtype: 'abroadexpense',
                title: 'Abroad',
                width: '100%'
            },
            {
                xtype: 'domesticexpense',
                title: 'Domestic',
                width: '100%'
            }
        ]
    }

});