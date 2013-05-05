Ext.define('ExpenseApp.view.Login', {
    extend: 'Ext.Panel',

    requires: [
        'Ext.TitleBar',
        'Ext.form.FieldSet',
        'Ext.field.Password',
        'Ext.form.Panel'
    ],

    config: {
        fullscreen: true,

        layout: {
            type: 'hbox'
        },

        items: [
            {
                xtype: 'titlebar',
                title: 'Expense App',
                docked: 'top'
            },
            {
                xtype: 'formpanel',
                id: 'loginForm',
                // TODO this is probably a hack by misusing the hbox
                flex: 1,
                items: [
                    {
                        xtype: 'fieldset',
                        items: [
                            {
                                xtype: 'textfield',
                                name: 'username',
                                id: 'username',
                                placeHolder: 'Username',
                                value: 'tim.ameye@student.kuleuven.be'
                            },
                            {
                                xtype: 'passwordfield',
                                name: 'password',
                                id: 'password',
                                placeHolder: 'Password',
                                value: 'test123'
                            }
                        ]
                    },
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        text: 'Log in',
                        // makes it a green button
                        ui: 'confirm',
                        width: "30%",
                        align: "right",
                        // submitting the form
                        id: 'loginButton'
                    }
                ]
            }
        ]
    }
});
