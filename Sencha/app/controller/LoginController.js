Ext.define('Expense.controller.LoginController', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            login: 'loginpanel'
        },

        control: {
            "button[action=login]": {
                tap: 'doLogin'
            }, 'button[action=logout]' : {
                tap : 'doLogout'
            }, 'loginpanel': {
                activate: 'checkLocalStorage'
            }
        }
    },

    checkLocalStorage: function(comp,opts){
        var employeeStore = Ext.getStore('employeestore');
        var localemployeestore = Ext.getStore('localemployeestore');
        localemployeestore.load({
            callback : function(options, success,response) {
                if(localemployeestore.getCount() != 0){
                    Ext.getCmp('loginpanel').setZIndex(-99);
                }
            }
        });

    },

    doLogin: function(button, e, options) {
        //Reset red borders
        Ext.getCmp('emailLogin').removeCls('x-field-custom-error');
        Ext.getCmp('password').removeCls('x-field-custom-error');

        var fields= this.getLogin().getValues();
        if(fields.emailLogin == '' || fields.password == ''){ //incorrect credentials
        	var message = '';
        	if(fields.emailLogin == ''){
				message = message + 'Email must be present <br>';
                Ext.getCmp('emailLogin').addCls('x-field-custom-error');
        	} if(fields.password == ''){
        		message = message + 'Password must be present <br>';
				Ext.getCmp('password').addCls('x-field-custom-error');;
        	}
			Ext.Msg.show({
				   title: 'Error',
				   message: message,
				   width: 300,
				   buttons: Ext.MessageBox.OK
			});
        }
        else{
            Ext.Viewport.setMasked({
                xtype: 'loadmask',
                message: 'Loading...'
            });
            Ext.Ajax.request({
                url : Expense.app.getBaseURL() + '/resources/userService/login',
                method : 'POST',
                //http://stackoverflow.com/questions/10830334/ext-ajax-request-sending-options-request-cross-domain-when-jquery-ajax-sends-get
                useDefaultXhrHeader: false,
                params: {
                    email: fields.emailLogin,
                    password: fields.password
                },
                success : function(response, opts) {
                    if(response.responseText.length <= 0){
                        Ext.Msg.show({
                            title: 'Error',
                            message: 'Login could not be found!',
                            width: 300,
                            buttons: Ext.MessageBox.OK
                        });
                    }
                    else{
                        login(response.responseText);
                    }
                },
                failure: function(response, opts) {
                    console.log('server-side failure with status code ' + response.status);
                }
            });

        }


    },

    doLogout : function(button, e, options) {
       logout();
    }

});

function logout(){
    Ext.Viewport.setMasked({
        xtype: 'loadmask',
        message: 'Loading...'
    });
    Ext.Ajax.request({
        url : Expense.app.getBaseURL() + '/resources/userService/logout',
        method : 'POST',
        useDefaultXhrHeader : false, // http://stackoverflow.com/questions/10830334/ext-ajax-request-sending-options-request-cross-domain-when-jquery-ajax-sends-get
        params : {
            token : Expense.app.token
        },
        callback : function(options, success,response) {
            Ext.Viewport.setMasked(false);
            Ext.Viewport.setActiveItem(Ext.getCmp('loginpanel'));
            Ext.getCmp('loginpanel').setZIndex(99);
            Ext.destroy(Ext.getCmp('home'));
            Ext.destroy(Ext.getCmp('viewport'));
            Ext.destroy(Ext.getCmp('totaloverviewlist'));
        }
    });
    localStorage.clear();
}

function login(token){
    //all components and( dependencies have to be destoyed when logged out..
    Ext.create('Expense.view.Home', {fullscreen: true});
    Expense.app.setToken(token);
    var employeeStore = Ext.getStore('employeestore');
    employeeStore.getProxy().setExtraParams({
        token: token
    });
    employeeStore.load();
    Ext.create('Expense.view.Viewport', {fullscreen: true});
    Ext.create('Expense.view.TotalOverviewList',{fullscreen: true});
    Ext.Viewport.setMasked(false);
}