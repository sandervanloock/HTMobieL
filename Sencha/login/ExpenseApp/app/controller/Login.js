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
        var user = Ext.create("ExpenseApp.model.User", this.getForm().getValues());
        var errors = user.validate();

        if (errors.isValid()) {
            Ext.Ajax.request({
                url:'http://kulcapexpenseapp.appspot.com/resources/userService/login',
                method:"POST",
                params:{
                    email:user.get("username"),
                    password:user.get("password")
                },
                success:function (response) {
                    var token = response.responseText;
                    if (token == "") {
                        Ext.Msg.alert("Authentication Failed", "Wrong username and/or password.");
                    } else {
                        Ext.Msg.alert("Token", token);
                    }
                }
            });
        } else {
            var data = "";
            errors.each(function (item, index, length) {
                data += item.getField() + ' ' + item.getMessage() + "</br>";
            });
            Ext.Msg.alert("Validation Failed", data);
        }
    }

});