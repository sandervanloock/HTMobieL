Ext.define('ExpenseApp.view.Login', {
    extend:'Ext.form.Panel',

    id:'loginForm',

    requires:[
        'Ext.TitleBar',
        'Ext.form.FieldSet',
        'Ext.field.Password'
    ],

    config:{
        fullscreen:true,

        items:[
            {
                xtype:'titlebar',
                title:'Expense App'
            },
            {
                xtype:'fieldset',

                items:[
                    {
                        xtype:'textfield',
                        name:'username',
                        placeHolder:'Username'
                    },
                    {
                        xtype:'passwordfield',
                        name:'password',
                        placeHolder:'Password'
                    }
                ]
            },
            {
                xtype:'button',
                text:'Log in',
                // makes it a green button
                ui:'confirm',
                // submitting the form
                id:'loginButton'
            }
        ]
    }
});
