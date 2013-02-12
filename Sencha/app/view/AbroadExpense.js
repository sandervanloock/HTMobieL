
Ext.define('Expense.view.AbroadExpense', {
    extend: 'Ext.form.Panel',
    alias: 'widget.abroadexpense',
    id: 'abroadexpense',
    
    requires: [
        'Ext.ux.Fileup'
    ],

    config: {
        scrollable: 'vertical',
        items: [
            {
                xtype: 'fieldset',
                id: 'abroadfield',
                title: '3. Add Expense',

                items: [
                    {
                        xtype: 'datepickerfield',
                        label: 'Date Of Expense',
                        placeHolder: 'mm/dd/yyyy',
                        value: new Date(),
                        name: 'date',
                        picker:{xtype:'datepicker', slotOrder:["day", "month", "year"]},
                        minValue: new Date(new Date().setMonth(new Date().getMonth()-2))
                    },
                    {
                        //http://www.mysamplecode.com/2012/11/sencha-touch-2-autocomplete-ajax.html
                        xtype: 'textfield',
                        placeHolder: 'Project Code',
                        name: 'projectCode',
                        id: 'projectCodeAbroad'
                    },
                    {
                        xtype: 'radiofield',
                        label: 'Hotel',
                        name: 'expenseType',
                        value: 'Hotel',
                        checked: true
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
                        xtype: 'numberfield',
                        placeHolder: 'Amount',
                        name: 'amount',
                        id: 'amountAbroad'
                    },
                    {
                        xtype: 'selectfield',
                        placeHolder: 'Currency',
                        name: 'currency',
                        store: 'currencystore',
                        displayField : 'currency',
                        valueField: 'currency'
                    },
                    {
                        xtype: 'textareafield',
                        placeHolder: 'Remarks',
                        name: 'remarks',
                        id: 'remarksAbroad'
                    },
                    {
                        xtype: 'textfield',
                        name: 'expenseLocation',
                        hidden: true,
                        value: 'Abroad'
                    },
                    {
                        id: 'fileBtnAbroad',
                        xtype: 'fileupload',
                        iconCls: 'download',
                        iconMask: true,
                        ui: 'confirm',
                        text: 'Upload Evidence',
                        width: 229,
                        height: 46,
                        actionUrl: 'getfile.php',
                        returnBase64Data: true
                    },
                    {
                        xtype: 'button',
                        height: 46,
                        ui: 'confirm',
                        width: 229,
                        iconCls: 'add',
                        iconMask: true,
                        text: 'Add',
                        action: 'sendAbroadExpense'
                    }
                ]
            }
        ]

    }

});