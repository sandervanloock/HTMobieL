
Ext.define('Expense.view.AbroadExpenseDetail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.abroadexpensedetail',

    config: {
        items: [
            {
                xtype: 'fieldset',
                title: '2. Overview',
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
                        xtype: 'radiofield',
                        label: 'Hotel',
                        name: 'expenseType',
                        value : 'Hotel'
                    },
                    {
                        xtype: 'radiofield',
                        label: 'Restaurant (Diner)',
                        name: 'expenseType',
                        value: 'Diner'
                    },
                    {
                        xtype: 'radiofield',
                        label: 'Other (please specify)',
                        name: 'expenseType',
                        value: 'Other'
                    },
                    {
                        xtype: 'textfield',
                        label: 'Amount',
                        name: 'amount'
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
            }
        ]
    }

});