
Ext.define('Expense.view.AbroadExpenseDetail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.abroadexpensedetail',

    config: {
        items: [
            {
                xtype: 'fieldset',
                title: '2. Overview',
                record: 'Expense.model.Expense',
                styleHtmlContent: true,
                items: [
                    {
                        xtype: 'datepickerfield',
                        placeHolder: 'Date Of Expense',
                        value: new Date(),
                        name: 'date',
                        readOnly: true
                    },
                    {
                        xtype: 'textfield',
                        placeHolder: 'Project Code',
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
                        placeHolder: 'Amount',
                        name: 'amount',
                        readOnly: true
                    },
                    {
                        xtype: 'selectfield',
                        placeHolder: 'Currency',
                        name: 'currency',
                        store: 'currencystore',
                        displayField : 'currency',
                        valueField: 'currency',
                        readOnly: true
                    },
                    {
                        xtype: 'textareafield',
                        placeHolder: 'Remarks',
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