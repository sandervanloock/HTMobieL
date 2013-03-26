Ext.Loader.setConfig({
    enabled: true
});

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
    models: [
        'Expense',
        'ExpenseForm',
        'Employee'
    ],
    stores: [
        'MenuStore',
        'ExpenseStore',
        'EmployeeStore',
        'LocalEmployeeStore',
        'ExpenseFormStore',
        'ProjectCodeStore',
        'CurrencyStore'
    ],
    views: [
        'Viewport',
        'Home',
        'Menu',
        'DomesticExpense',
        'DomesticExpenseDetail',
        'AbroadExpense',
        'AbroadExpenseDetail',
        'Page',
        'OverviewList',
        'Overview',
        'TotalOverviewList',
        'LoginPanel',
        'SignField',
        'AddExpenseContainer',
        'InfoPanel',
        'Ext.ux.PDF',
        'Ext.ux.Fileup',
        'Ext.ux.Signaturefield'
        //'Expense.view.ProjectCodeList'
    ],
    name: 'Expense',
    controllers: [
        'MainController',
        'MenuController',
        'ExpenseController',
        'MyInfoController',
        'LoginController',
        'CurrencyController'
    ],

    launch: function() {
        Ext.create('Expense.view.LoginPanel', {fullscreen: true});
        Ext.create('Expense.view.Home', {fullscreen: true});
        Ext.create('Expense.view.Viewport', {fullscreen: true});
        Ext.create('Expense.view.TotalOverviewList',{fullscreen: true});
        var employeeStore = Ext.getStore('employeestore');
        var localemployeestore = Ext.getStore('localemployeestore');
        localemployeestore.load({
            callback : function(options, success,response) {
                console.log('local storage loaded');
            }
        });
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
