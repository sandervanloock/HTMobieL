
Ext.define('Expense.view.OverviewList', {
    extend: 'Ext.dataview.List',
    alias: 'widget.overviewlist',

    config: {
        id: 'overviewlist',
        ui: 'round',
        store: 'expensestore',
        onItemDisclosure: true,
        itemTpl: [
            '<div>{date:date("d/m/Y")} &mdash; <small> {expenseType} : {amount}  EUR</small></div>'
        ]
    }

});

