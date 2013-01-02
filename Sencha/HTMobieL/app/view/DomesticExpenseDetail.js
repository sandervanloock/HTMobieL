
Ext.define('Expense.view.DomesticExpenseDetail', {
    extend: 'Ext.form.Panel',
    alias: 'widget.domesticexpensedetail',

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
                        value:  'Hotel'
                    },
                    {
                        xtype: 'radiofield',
                        label: 'Restaurant',
                        name: 'expenseType',
                        value:  'Lunch',
                    },
                    {
                        xtype: 'radiofield',
                        label: 'Other (please specify)',
                        name: 'expenseType',
                        value: 'Other'
                    },
                    {
                        xtype: 'radiofield',
                        label: 'Train / Plane tickets',
                        name: 'expenseType',
                        value: 'Ticket'
                    },
                    {
                        xtype: 'radiofield',
                        label: 'Restaurant (Diner)',
                        name: 'expenseType',
                        value:  'Diner'
                    },
                    {
                        xtype: 'textfield',
                        name: 'amount',
                        label: 'Amount (€)',
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