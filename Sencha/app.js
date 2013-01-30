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
    /**
     * Validates the current data against all of its configured {@link #validations} and returns an
     * {@link Ext.data.Errors Errors} object
     * @return {Ext.data.Errors} The errors object
     */
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
        'Ext.ux.panel.PDF',
        'Ext.ux.Fileup',
        'Ext.ux.Signaturefield',
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

        if(Ext.os.is.Phone){
            Ext.getCmp('menupanel').setHidden(true);
            Ext.getCmp('menuButton').setHidden(false);
        }
    },
    token : '',
    
    setToken : function(args){
    	this.token = args;
    },
    
    getToken: function(){
    	return this.token;
    },
    
    //baseURL: 'http://localhost:8888',
    baseURL: 'http://kulcapexpenseapp.appspot.com',
    
    getBaseURL : function(){
    	return this.baseURL;
    },

    employee: null,

    setEmployee: function(args){
        this.employee = args;
    },

    getEmployee: function(){
        return this.employee;
    },
    
    expenseForm: null,
    
    setExpenseForm: function(args){
    	this.expenseForm = args;
    },
    
    getExpenseForm: function(){
    	return this.expenseForm;
    }
});
