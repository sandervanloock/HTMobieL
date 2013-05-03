Ext.define('ExpenseApp.store.Songs', {
    extend: 'Ext.data.Store',

    config: {
        model: 'ExpenseApp.model.Song',
        data: [
            {id: 1},
            {id: 2},
            {id: 3}
        ]
    }
});