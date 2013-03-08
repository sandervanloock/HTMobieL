Ext.define('ExpenseApp.view.Login', {
    extend:'Ext.Panel',

    requires:[
        'Ext.TitleBar',
        'Ext.form.FieldSet',
        'Ext.field.Password',
        'Ext.form.Panel'
    ],

    config:{
        fullscreen:true,

        layout:{
            type:'hbox'
        },

        items:[
            {
                xtype:'titlebar',
                title:'Expense App',
                docked:'top'
            },
            {
                xtype:'formpanel',
                id:'loginForm',
                // TODO this is probably a hack
                flex:1,
                items:[
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
        ]
    }
});
