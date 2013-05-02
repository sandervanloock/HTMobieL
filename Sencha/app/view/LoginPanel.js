Ext.define('Expense.view.LoginPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.loginpanel',

    config: {
        id: 'loginpanel',
        standardSubmit: true,
        items: [
            {
                xtype: 'fieldset',
                title: 'Please, log in:',
                top:  '20%',
                width: '100%',
                padding: '20 20 20 20',
                  items: [
                    {
                        xtype: 'emailfield',
                        id: 'emailLogin',
                        placeHolder: 'Email',
                        name: 'emailLogin',
                        value: 'tim.ameye@student.kuleuven.be'
                    },
                    {
                        xtype: 'passwordfield',
                        id: 'password',
                        placeHolder: 'Password',
                        name: 'password',
                        value: 'test123'
                    },
                    {
                        xtype: 'button',
                        height: 46,
                        id: 'login',
                        ui: 'action-round',
                        width: 212,
                        iconAlign: 'center',
                        text: 'Login',
                        action: 'login',
                        style: {
                            background: 'green'
                        }
                    }
                  ]
            }
        ]
    }

});