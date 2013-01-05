
Ext.define('Expense.view.InfoPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.infopanel',
    
    requires: [
       'Expense.model.Employee'
    ],

    config: {
    	id: 'infopanel',
    	record: 'Expense.model.Employee',
        items: [
            {
                xtype: 'fieldset',
                id: 'infofield',
                title: '1. Your info',
                items: [
                    {
                        xtype: 'selectfield',
                        label: 'Month',
                        id: 'month',
                        name: 'month',
                        options: [
                             {text: 'January', value: '0'},
                             {text: 'February', value: '1'},
                             {text: 'March', value: '2'},
                             {text: 'April', value: '3'},
                             {text: 'May', value: '4'},
                             {text: 'June', value: '5'},
                             {text: 'July', value: '6'},
                             {text: 'August', value: '7'},
                             {text: 'September', value: '8'},
                             {text: 'October', value: '9'},
                             {text: 'November', value: '10'},
                             {text: 'December', value: '11'},
                         ]
                    },
                    {
                        xtype: 'selectfield',
                        label: 'Year',
                        id: 'year',
                        name: 'year'
                    },
                    {
                        xtype: 'textfield',
                        label: 'First Name',
                        name: 'firstName',
                        readOnly: true
                    },
                    {
                        xtype: 'textfield',
                        label: 'Last Name',
                        name: 'lastName',
                        readOnly: true
                    },
                    {
                        xtype: 'textfield',
                        label: 'Employee Number',
                        name: 'employeeNumber',
                        id: 'employeeNumber'
                    },
                    {
                        xtype: 'selectfield',
                        label: 'Unit',
                        name: 'unitId',
                        id: 'unitId',
                        options:[
							{text: '1', value: '1'},
							{text: '2', value: '2'},
							{text: '3', value: '3'},
							{text: '4', value: '4'},
							{text: '5', value: '5'},
							{text: '6', value: '6'},
							{text: '7', value: '7'},
                        ]
                    },
                    {
                        xtype: 'emailfield',
                        label: 'Email',
                        name: 'email',
                        id: 'email',
                        placeHolder: 'email@example.com'
                    },
                    {
                    	xtype: 'button',
                        docked: 'right',
                        ui: 'confirm-round',
                        iconCls: 'action',
                        iconMask: true,
                        text: 'Next',
                    	action: 'showExpenseOverview'
                    }
                ]
            }
        ]
    }

});