Ext.define('Expense.view.DomesticExpense', {
    extend: 'Ext.form.Panel',
    alias: 'widget.domesticexpense',
    id: 'domesticexpense',

    config: {
        scrollable: 'vertical',
        items: [
            {
                xtype: 'fieldset',
                id: 'domesticfield',
                title: '3. Add Expense',
                activeItem: '',
                items: [
                    {
                    	  xtype: 'datepickerfield',
                          placeHolder: 'Date Of Expense',
                          value: new Date(),
                          name: 'date'
                    },
                    {
                        xtype: 'textfield',
                        placeHolder: 'Project Code',
                        name: 'projectCode',
                        id: 'projectCodeDomestic'
                    },
                    {
                        xtype: 'radiofield',
                        label: 'Hotel',
                        name: 'expenseType',
                        value:  'Hotel',
                        checked: true
                    },
                    {
                        xtype: 'radiofield',
                        label: 'Restaurant',
                        name: 'expenseType',
                        value:  'Lunch'
                    },
                    {
                        xtype: 'radiofield',
                        id: 'other',
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
                        xtype: 'numberfield',
                        name: 'amount',
                        placeHolder: 'Amount (€)',
                        id: 'amountDomestic'
                    },
                    {
                        xtype: 'textareafield',
                        placeHolder: 'Remarks',
                        name: 'remarks',
                        id: 'remarksDomestic'
                    },
                  //DOMESTIC(1), ABROAD(2);
                    {
                        xtype: 'textfield',
                        name: 'expenseLocation',
                        hidden: true,
                        value: 'Domestic'
                    },
                    {
                        xtype: 'textfield',
                        name: 'currency',
                        hidden: true,
                        value: 'EUR'
                    },
                    {
                        xtype: 'container',
                        layout: 'hbox',
                        items: [
                            {
                                id: 'fileLoadDomestic',
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
                                action: 'sendDomesticExpense'
                            }
                        ]
                    }
                ]
            },
            {
                itemId: 'loadedImageDomestic',
                xtype: 'img',
                width: '80%',
                height: '200px',
                style: 'margin-top:15px;'
            }
        ]
    }

});