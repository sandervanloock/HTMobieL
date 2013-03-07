
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
                activeItem: '',
                styleHtmlContent: true,
                items: [
                    {
                        xtype: 'datepickerfield',
                        placeHolder: 'Date Of Expense',
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
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                id: 'fileLoadAbroad',
                                xtype: 'fileupload',
                                autoUpload: true,
                                loadAsDataUrl: true,
                                iconCls: 'download',
                                iconMask: true,
                                states: {
                                    browse: {
                                        text: 'Upload Evidence',
                                        ui: 'confirm'
                                    },
                                    ready: {
                                        text: 'Load'
                                    },
                                    uploading: {
                                        text: 'Loading',
                                        loading: true
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                ui: 'confirm',
                                iconCls: 'add',
                                iconMask: true,
                                text: 'Add',
                                action: 'sendAbroadExpense'
                            }
                        ]
                    },

                ]
            },
            {
                itemId: 'loadedImageAbroad',
                xtype: 'img',
                width: '80%',
                height: '200px',
                style: 'margin-top:15px;'
            }
        ]

    }

});