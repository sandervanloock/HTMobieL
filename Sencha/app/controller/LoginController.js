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
        var email = localStorage.getItem('email')
        var password = localStorage.getItem('password');
        if(email != null && password != null)
            login(email, password);
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
            login(fields.emailLogin, fields.password);
        }


    },

    doLogout : function(button, e, options) {
       logout(); //TODO
    }

});

function logout(){
    Ext.Ajax.request({
        url : Expense.app.getBaseURL() + '/resources/userService/logout',
        method : 'POST',
        useDefaultXhrHeader : false, // http://stackoverflow.com/questions/10830334/ext-ajax-request-sending-options-request-cross-domain-when-jquery-ajax-sends-get
        params : {
            token : Expense.app.token
        },
        callback : function(options, success,response) {
            Ext.Viewport.setActiveItem(Ext.getCmp('loginpanel'));
            Ext.destroy(Ext.getCmp('home'));
            Ext.destroy(Ext.getCmp('viewport'));
            Ext.destroy(Ext.getCmp('totaloverviewlist'));
        }
    });
    localStorage.removeItem('email');
    localStorage.removeItem('password');
}

function login(userEmail, userPassword){
    Ext.Ajax.request({
        url : Expense.app.getBaseURL() + '/resources/userService/login',
        method : 'POST',
        //http://stackoverflow.com/questions/10830334/ext-ajax-request-sending-options-request-cross-domain-when-jquery-ajax-sends-get
        useDefaultXhrHeader: false,
        params: {
            email: userEmail,
            password: userPassword
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
                //all components and( dependencies have to be destoyed when logged out..
                Ext.create('Expense.view.Home', {fullscreen: true});
                Expense.app.setToken(response.responseText);
                var employeeStore = Ext.getStore('employeestore');
                employeeStore.getProxy().setExtraParams({
                    token: response.responseText
                });
                employeeStore.load({
                    callback: function(records, operation, success) {
                        // the operation object contains all of the details of the load operation
                        console.log(records);
                    },
                    scope: this
                });
                Ext.create('Expense.view.Viewport', {fullscreen: true});
                Ext.create('Expense.view.TotalOverviewList',{fullscreen: true});
                //store credentials in local storage
                localStorage.setItem('email',userEmail);
                localStorage.setItem('password',userPassword);
            }
        },
        failure: function(response, opts) {
            console.log('server-side failure with status code ' + response.status);
        }
    });
}