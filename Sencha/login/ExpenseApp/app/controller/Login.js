Ext.define("ExpenseApp.controller.Login", {
    extend:"Ext.app.Controller",

    requires:[
        "ExpenseApp.model.User"
    ],

    config:{
        refs:{
            form:"#loginForm",
            btn:"#loginButton"
        },

        control:{
            btn:{
                tap:"login"
            }
        }
    },

    login:function () {
        var user = Ext.create('ExpenseApp.model.User', this.getForm().getValues());
    }

});