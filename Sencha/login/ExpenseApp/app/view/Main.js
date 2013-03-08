Ext.define('ExpenseApp.view.Main', {
    extend:'Ext.Panel',

    requires:[
        'Ext.TitleBar',
        'Ext.form.FieldSet',
        'Ext.field.Password'
    ],

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
