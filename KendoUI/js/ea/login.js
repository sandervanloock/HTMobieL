function login() {
    var validator = $("#login-view").kendoValidator().data("kendoValidator");
    //validate login screen
    if (validator.validate()){
        app.showLoading();
        $.ajax({
            type:"POST",
            dataType:"text",
            url:EA.baseURL + "resources/userService/login",
            data:{
                'email':$("#login-username").val(),
                'password':$("#login-password").val()
            },
            success:function (token,status,jqXHR) {
                // don't write the loading hide in a complete handler,
                // because we chain the ajax requests
                if (status=='nocontent' || token == '') {
                    EA.showDialog("The username and/or password are incorrect.");
                } else {
                    // set the token
                    EA.setToken(token);

                    // don't go to the home page yet, but first fetch user info
                    $.ajax({
                        type:"POST",
                        dataType:"json",
                        url:EA.baseURL + "resources/userService/getEmployee",
                        data:{
                            'token':EA.getToken()
                        },
                        error:function () {
                            EA.showDialog("Could not fetch user information");
                        },
                        success:function (userData,textstatus,jqXHR) {
                            if(jqXHR.status==204)
                                login(); //backend return no data,  resent login form (backend issue)
                            else{
                                EA.setUser(userData);
                                if (Modernizr.localstorage)
                                    localStorage.user = JSON.stringify(employee.toJSON());
                                app.navigate("#home")
                            }
                        },
                        complete: function(){
                            app.hideLoading();
                        }
                    });
                }
            }
        });
    }
    else{
        EA.showError(validator.errors());
    }
}

function logout(){
    if (navigator.onLine) {
        $.ajax({
            type:"POST",
            url:EA.baseURL + "resources/userService/logout",
            data:{
                'token':EA.getToken()
            },
            success:function () {
                // empty the session
                EA.setToken(null);
                // empty user information
                EA.deleteUser();
                // go to login page
                app.navigate("#login-view")
            },
            error:function () {
                EA.showBackendError("Could not log out");
            }
        });
    }
}