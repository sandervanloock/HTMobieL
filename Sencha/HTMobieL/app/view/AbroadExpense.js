/*
 * File: app/view/AbroadExpense.js
 *
 * This file was generated by Sencha Architect version 2.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Architect does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Expense.view.AbroadExpense', {
    extend: 'Ext.form.Panel',
    alias: 'widget.abroadexpense',

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
                        xtype: 'autocompletefield',
                        label: 'Project Code',
                        value: '',
                        name: 'projectCode',
                        config: {
                            proxy: {
                                type: 'ajax',
                                url: 'http://kulcapexpenseapp.appspot.com/resources/expenseService/getProjectCodeSuggestion', //TODO url
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
                        }
                    },
                    {
                        xtype: 'radiofield',
                        label: 'Hotel',
                        name: 'expenseLocationId'
                    },
                    {
                        xtype: 'radiofield',
                        label: 'Restaurant (Diner)',
                        name: 'expenseLocationId'
                    },
                    {
                        xtype: 'radiofield',
                        label: 'Other (please specify)',
                        name: 'expenseLocationId'
                    },
                    {
                        xtype: 'textfield',
                        label: 'Amount',
                        name: 'amount'
                    },
                    {
                        xtype: 'selectfield',
                        label: 'Currency',
                        name: 'currency'
                    },
                    {
                        xtype: 'textareafield',
                        label: 'Remarks',
                        name: 'remarks'
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