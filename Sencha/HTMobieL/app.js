Ext.Loader.setConfig({
    enabled: true
});

Ext.application({
    models: [
        'Expense',
        'Employee'
    ],
    stores: [
        'MenuStore',
        'ExpenseStore',
        'EmployeeStore',
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
        'ExpenseDetail',
        'SignField',
        'AddExpenseContainer',
        'InfoPanel',
        'Ext.ux.panel.PDF'
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
    	/*Ext.define('AutocompleteField', {
    		extend: 'Ext.field.Text',
    		alias: 'widget.autocompletefield',
    		
    		config: {
    			component: {
    				xtype: 'input',
    				type: 'text'
    			}
    		},

    		currentSelectedValue: null,
    		currentShownValue: '',
    		isSelectedItem: false,

    		setValue: function(newShownValue, newSelectedValue) {
    			this.currentShownValue = newShownValue;
    			this.getComponent().setValue(newShownValue);
    			this.currentSelectedValue = newSelectedValue;
    		},

    		getValue: function(getShownValue) {
    			return (getShownValue || !isSelectedItem ? this.getComponent().getValue() : this.currentSelectedValue);
    		},

    		initialize: function() {
    			var that = this;

    			if (!that.config.config.proxy || !that.config.config.proxy.url || !that.config.config.needleKey) throw new Error('Proxy and needleKey must be set with autocomplete config.');
    			if (!that.config.config.labelKey) throw new Error('LabelKey must be defined with autocomplete config.');

    			if (!that.config.config.resultsHeight) that.config.config.resultsHeight = 200;

    			if (!Ext.ModelManager.getModel('AutocompleteResult')) {
    				Ext.define('AutocompleteResult', {
    					extend: 'Ext.data.Model',
    					config: {
    						fields: ['id',{name:that.config.config.labelKey,type:'string'}]
    					}
    				});
    			}

    			this.resultsStore = Ext.create('Ext.data.Store', {
    				model: 'AutocompleteResult',
    				config: {
    					autoLoad: false
    				}
    			});
    			
    			this.resultsStore.setProxy(that.config.config.proxy);

    			this.resultsList = Ext.create('Ext.List', {
    				renderTo: this.getComponent().element.dom,
    				store: that.resultsStore,
    				margin: 2,
    				itemTpl: '{data}'
    			});

    			var blurTimeout = false;
    			var searchTimeout = false;

    			var doSearchWithTimeout = function() {
    				if (blurTimeout) clearTimeout(blurTimeout);
    				if (searchTimeout) clearTimeout(searchTimeout);

    				if (that.isSelectedItem || that.getComponent().getValue() == '') return;

    				searchTimeout = setTimeout(function() {
    					var uriString = that.config.config.proxy.url;
    					that.resultsStore.getProxy().setUrl(uriString);
    					var params = that.getValue(true);
    					that.resultsStore.getProxy().setExtraParams({
    						keyword: params
    					});
    					that.isSelectedItem = false;
    					that.resultsStore.load();
    					console.log(that.resultsStore); //TODO teruggegeven formaat deftig in lijst
    					that.resultsList.setHeight(that.config.config.resultsHeight);
    				}, 300);
    			};
    			
    			this.resultsList.on('itemtouchend', function() {
    				if (blurTimeout) clearTimeout(blurTimeout);
    			});

    			this.resultsList.onScroll = function() {};

    			this.resultsList.on('itemtap', function(self, index, target, record) {
    				that.setValue(record.get('name'), record.get('id'));
    				that.isSelectedItem = true;

    				blurTimeout = setTimeout(function() {
    					that.resultsList.setHeight(0);
    				}, 500);
    			});

    			this.getComponent().on('focus', doSearchWithTimeout);
    			this.getComponent().on('keyup', function() {
    				that.isSelectedItem = false;
    				doSearchWithTimeout();
    			});

    			this.getComponent().on('blur', function(event) {
    				if (searchTimeout) clearTimeout(searchTimeout);

    				blurTimeout = setTimeout(function() {
    					that.resultsList.setHeight(0);
    				}, 500);
    			});

    		}

    	});*/
        Ext.create('Expense.view.LoginPanel', {fullscreen: true}); 
        Ext.create('Expense.view.Home', {fullscreen: true});
	    Ext.create('Expense.view.Viewport', {fullscreen: true});
	    Ext.create('Expense.view.TotalOverviewList',{fullscreen: true});
    },
    token : '',
    
    setToken : function(args){
    	this.token = args;
    },
    
    getToken: function(){
    	return this.token;
    },
    
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
    }
});
