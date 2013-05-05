Ext.define("ExpenseApp.controller.Login", {
    extend: "Ext.app.Controller",

    requires: [
        "ExpenseApp.model.User"
    ],

    config: {
        refs: {
            form: "#loginForm",
            btn: "#loginButton"
        },

        control: {
            btn: {
                tap: "login"
            }
        }
    },

    login: function () {
        var form = this.getForm();
        var user = Ext.create("ExpenseApp.model.User", form.getValues());
        var errors = user.validate();

        Ext.getCmp("username").removeCls('red-border');
        Ext.getCmp("password").removeCls('red-border');

        if (errors.isValid()) {
            Ext.Ajax.request({
                url: 'http://kulcapexpenseapp.appspot.com/resources/userService/login',
                method: "POST",
                params: {
                    email: user.get("username"),
                    password: user.get("password")
                },
                success: function (response) {
                    var token = response.responseText;
                    if (token == "") {
                        Ext.Msg.alert("Authentication Failed", "Wrong username and/or password.");
                    } else {
                        Ext.Viewport.setActiveItem(Ext.create('ExpenseApp.view.List'));
                    }
                }
            });
        } else {
            var data = "";
            errors.each(function (item, index, length) {
                data += item.getField() + ' ' + item.getMessage() + "</br>";
                Ext.getCmp(item.getField()).addCls('red-border');
            });
            Ext.Msg.alert("Validation Failed", data);
        }
    }
});