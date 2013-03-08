Ext.define('ExpenseApp.view.Main', {
    extend:'Ext.Panel',

    config:{
        fullscreen:true,

        items:[
            {
                title:'Expense App',
                xtype:'titlebar'
            },
            {
                xtype:'fieldset',
                items:[
                    {
                        xtype:'textfield',
                        name:'username',
                        label:'Username'
                    },
                    {
                        xtype:'passwordfield',
                        name:'password',
                        label:'Password'
                    }
                ]
            }
        ]
    }
});
