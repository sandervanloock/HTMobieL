Ext.define('Expense.store.MenuStore', {
    extend: 'Ext.data.Store',
    alias: 'store.menustore',

    config: {
        autoLoad: true,
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
        storeId: 'menustore',
        fields: [
            {
                name: 'item'
            }
        ]
    }
});