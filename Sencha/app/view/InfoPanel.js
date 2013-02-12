
Ext.define('Expense.view.InfoPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.infopanel',
    
    requires: [
       'Expense.model.Employee'
    ],

    config: {
    	id: 'infopanel',
    	record: 'Expense.model.Employee',
        layout: 'vbox',
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
                        placeHolder: 'First Name',
                        name: 'firstName',
                        readOnly: true
                    },
                    {
                        xtype: 'textfield',
                        placeHolder: 'Last Name',
                        name: 'lastName',
                        readOnly: true
                    },
                    {
                        xtype: 'textfield',
                        placeHolder: 'Employee Number',
                        name: 'employeeNumber',
                        id: 'employeeNumber'
                    },
                    {
                        xtype: 'selectfield',
                        placeHolder: 'Unit',
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
                            {text: '8', value: '8'},
                            {text: '9', value: '9'},
                            {text: '10', value: '10'}
                        ]
                    },
                    {
                        xtype: 'emailfield',
                        name: 'email',
                        id: 'email',
                        placeHolder: 'Email'
                    },
                ]
            },
            {
                xtype: 'button',
                text: 'Next',
                ui: 'action',
                action: 'showOverviewList',
                width: '200px',
                right: '0px'
            }
        ]
    }

});