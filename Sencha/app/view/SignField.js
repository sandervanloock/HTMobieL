Ext.define('Expense.view.SignField', {
    extend: 'Ext.form.Panel',
    alias: 'widget.signfield',

    config: {
        title: '4. Sign & Send',
        items: [
            {
                xtype: 'fieldset',
                //id: 'signfield',
                items: [
                    {
                        xtype: 'signaturefield',
                        id: 'signature',
                        sigWidth: 200,
                        sigHeight: 100
                    },
                    {
                        xtype: 'textareafield',
                        name: 'remarks',
                        placeHolder: 'Remarks'
                    },
                    {
                        xtype: 'togglefield',
                        name: 'notification',
                        value: true,
                        label: 'Status notification via Email:'
                    }
            ]},
            {
                xtype: 'button',
                text: 'Send',
                ui: 'action',
                action: 'sendExpenses'
            }
        ]
    }

});