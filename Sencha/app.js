/*
    This file is generated and updated by Sencha Cmd. You can edit this file as
    needed for your application, but these edits will have to be merged by
    Sencha Cmd when it performs code generation tasks such as generating new
    models, controllers or views and when running "sencha app upgrade".

    Ideally changes to this file would be limited and most work would be done
    in other places (such as Controllers). If Sencha Cmd cannot merge your
    changes and its generated code, it will produce a "merge conflict" that you
    will need to resolve manually.
*/

// DO NOT DELETE - this directive is required for Sencha Cmd packages to work.
//@require @packageOverrides

//<debug>
Ext.Loader.setPath({
    'Ext': 'touch/src',
    'Expense': 'app'
});
//</debug>

Ext.define("fix.me.some.radio.buttons", {
    override: "Ext.field.Radio",
    getValue: function() {
        return this._value;
    }
});

Ext.apply(Ext.data.validations , {
    custom : function(config, value, model) {
        return config.validator.apply(this, arguments);
    }
});

Ext.Loader.setConfig({
    enabled: true
});

Ext.override(Ext.data.Model, {
    validate: function() {
        var errors      = new Ext.data.Errors(),
            validations = this.validations,
            validators  = Ext.data.validations,
            length, validation, field, valid, type, i;

        if (validations) {
            length = validations.length;
            for (i = 0; i < length; i++) {
                validation = validations.items[i];
                field = validation.field || validation.name;
                type  = validation.type;
                valid = validators[type](validation, this.get(field), this);

                if (!valid) {
                    errors.add({
                        field  : field,
                        message: validation.message || validators[type + 'Message'],
                        name: validation.name
                    });
                }
            }
        }

        return errors;
    }
});

Ext.application({
    name: 'Expense',

    requires: [
        'Ext.MessageBox'
    ],
    models:[
        'Employee',
        'Expense',
        'ExpenseForm'
    ],

    views: [
        'AbroadExpense',
        'AbroadExpenseDetail',
        'AddExpenseContainer',
        'DomesticExpense',
        'DomesticExpenseDetail',
        'Home',
        'InfoPanel',
        'LoginPanel',
        'Menu',
        'Overview',
        'OverviewList',
        'Page',
        'ProjectCodeList',
        'SignField',
        'TotalOverviewList',
        'Viewport',
        'Ext.ux.PDF',
        'Ext.ux.Fileup',
        'Ext.ux.Signaturefield'
    ],

    stores: [
        'CurrencyStore',
        'EmployeeStore',
        'ExpenseFormStore',
        'ExpenseStore',
        'LocalEmployeeStore',
        'MenuStore',
        'ProjectCodeStore'
    ],

    controllers: [
        'CurrencyController',
        'ExpenseController',
        'LoginController',
        'MainController',
        'MenuController',
        'MyInfoController'
    ],
    icon: {
        '57': 'resources/icons/Icon.png',
        '72': 'resources/icons/Icon~ipad.png',
        '114': 'resources/icons/Icon@2x.png',
        '144': 'resources/icons/Icon~ipad@2x.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function() {
        Ext.create('Expense.view.LoginPanel', {fullscreen: true});
        Ext.create('Expense.view.Home', {fullscreen: true});
        Ext.create('Expense.view.Viewport', {fullscreen: true});
        Ext.create('Expense.view.TotalOverviewList',{fullscreen: true});
        var employeeStore = Ext.getStore('employeestore');
        var localemployeestore = Ext.getStore('localemployeestore');
        localemployeestore.load({
            callback: function(options, success,response) {
                console.log('local storage loaded');
            }
        });
    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function(buttonId) {
                if (buttonId === 'yes') {
                    window.location.reload();
                }
            }
        );
    }
});

var baseURL = 'http://kulcapexpenseapp.appspot.com';
var employee = null;
var expenseForm = null;
var token = "";

function getToken(){
    if (Modernizr.sessionstorage) {
        return sessionStorage.token;
    } else {
        return this.token;
    }
}

function setToken(args){
    if (Modernizr.sessionstorage) {
        sessionStorage.token = args;
    } else {
        this.token = args;
    }
}

function getBaseURL(){
    return 'http://kulcapexpenseapp.appspot.com';
};

function setEmployee(args){
    this.employee = args;
};

function getEmployee(){
    return this.employee;
};

function setExpenseForm(args){
    this.expenseForm = args;
};

function getExpenseForm(){
    return this.expenseForm;
};
