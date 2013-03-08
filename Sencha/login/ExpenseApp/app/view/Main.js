Ext.define('ExpenseApp.view.Main', {
    extend:'Ext.Panel',

    config:{
        html:'Welcome to my app',

        fullscreen:true,

        items:[
            {
                title:'Expense App',
                xtype:'titlebar'
            }
        ]
    }
});
