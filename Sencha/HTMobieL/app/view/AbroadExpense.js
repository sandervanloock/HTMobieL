
Ext.define('Expense.view.AbroadExpense', {
    extend: 'Ext.form.Panel',
    alias: 'widget.abroadexpense',
    id: 'abroadexpense',

    config: {
        items: [
            {
                xtype: 'fieldset',
                title: '3. Add Expense',
                items: [
                    {
                        xtype: 'datepickerfield',
                        label: 'Date Of Expense',
                        placeHolder: 'mm/dd/yyyy',
                        value: new Date(),
                        name: 'date'
                    },
                    {
                        xtype: 'textfield',
                        label: 'Project Code',
                        value: 'G05656', //TODO verwijderen
                        name: 'projectCode', //TODO
                       /* config: {
                            proxy: {
                                type: 'ajax',
                                url: Expense.app.getBaseURL() + '/resources/expenseService/getProjectCodeSuggestion', //TODO url
                                reader: {
                                    type: 'json',
                                    rootProperty: 'data'
                                },
                                actionMethods: {
                                    create : 'POST',
                                    read   : 'POST',
                                    update : 'POST',
                                    destroy: 'POST'
                                }
                            },
					        resultsHeight: 5,
							needleKey: 'term',
							labelKey: 'data'
                        }*/
                    },
                    {
                        xtype: 'radiofield',
                        label: 'Hotel',
                        name: 'expenseType',
                        value: 'Hotel'
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
                        value: '50', //TODO
                        name: 'amount'
                    },
                    {
                        xtype: 'selectfield',
                        label: 'Currency',
                        name: 'currency',
                        store: 'currencystore',
                        displayField : 'currency',
                        valueField: 'currency'
                    },
                    {
                        xtype: 'textareafield',
                        label: 'Remarks',
                        value: 'test', //TODO
                        name: 'remarks'
                    },
                    {
                        xtype: 'textfield',
                        name: 'expenseLocation',
                        hidden: true,
                        value: 'Abroad'
                    },
                    {
                        xtype: 'button',
                        height: 43,
                        id: 'back',
                        ui: 'action-round',
                        width: 230,
                        iconCls: 'download',
                        iconMask: true,
                        text: 'Upload Evidence',
                        action: 'uploadEvidence'
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