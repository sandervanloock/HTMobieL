
Ext.define('Expense.view.AbroadExpenseDetail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.abroadexpensedetail',

    config: {
        items: [
            {
                xtype: 'fieldset',
                title: '2. Overview',
                record: 'Expense.model.Expense',
                items: [
                    {
                        xtype: 'datepickerfield',
                        label: 'Date Of Expense',
                        placeHolder: 'mm/dd/yyyy',
                        value: new Date(),
                        name: 'date',
                        readOnly: true
                    },
                    {
                        xtype: 'textfield',
                        label: 'Project Code',
                        name: 'projectCode',
                        readOnly: true
                    },
                    {
                        xtype: 'fieldset',
                        defaults: {
                            xtype: 'radiofield',
                            name : 'expenseType',
                            disabled:true
                        },
                        padding: '0 0 0 0', //TODO
                        items : [
                            {
                                label: 'Hotel',
                                value : 'Hotel'
                            },
                            {
                                label: 'Restaurant (Diner)',
                                value: 'Diner'
                            },
                            {
                                label: 'Other (please specify)',
                                value: 'Other'
                            }
                        ]
                    },
                    {
                        xtype: 'textfield',
                        label: 'Amount',
                        name: 'amount',
                        readOnly: true
                    },
                    {
                        xtype: 'selectfield',
                        label: 'Currency',
                        name: 'currency',
                        store: 'currencystore',
                        displayField : 'currency',
                        valueField: 'currency',
                        readOnly: true
                    },
                    {
                        xtype: 'textareafield',
                        label: 'Remarks',
                        name: 'remarks',
                        readOnly: true
                    }
                ]
            },
            {
                xtype: 'image',
                src: 'http://www.sencha.com/assets/images/sencha-avatar-64x64.png',
                flex: 1
            }
        ]
    }

});