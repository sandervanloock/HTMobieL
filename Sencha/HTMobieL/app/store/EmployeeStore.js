/*
 * File: app/store/EmployeeStore.js
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

Ext.define('Expense.store.EmployeeStore', {
    extend: 'Ext.data.Store',
    alias: 'store.employeestore',

    requires: [
        'Expense.model.Employee'
    ],

    config: {
        model: 'Expense.model.Employee',
        storeId: 'employeestore',
        proxy: {
            type: 'ajax',
            url: 'http:///kulcapexpenseapp.appspot.com/resources/userService/getEmployee', //TODO url
            extraParams:{
                token: Expense.app.getToken()
            },
            actionMethods: {
                create : 'POST',
                read   : 'POST',
                update : 'POST',
                destroy: 'POST'
            },
            reader: {
                type: 'json'
            }
        }
    }
});