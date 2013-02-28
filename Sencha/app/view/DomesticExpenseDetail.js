
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
                        xtype: 'fieldset',
                        defaults: {
                            xtype: 'radiofield',
                            name : 'expenseType',
                            disabled: true
                        },
                        items : [
                            {
                                label: 'Hotel',
                                value:  'Hotel'
                            },
                            {
                                label: 'Restaurant',
                                value:  'Lunch'
                            },
                            {
                                label: 'Other (please specify)',
                                value: 'Other'
                            },
                            {
                                label: 'Train / Plane tickets',
                                value: 'Ticket'
                            },
                            {
                                label: 'Restaurant (Diner)',
                                value:  'Diner'
                            }
                        ]
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
                    },{
                        xtype: 'img',
                        name: 'evidence'
                    }
                ]
            }
        ]
    }

});