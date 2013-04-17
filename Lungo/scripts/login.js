Lungo.dom("#login-screen-button").on("tap", function (event) {
    console.log("making ajax request");

    Lungo.Service.post(
        EA.baseURL + 'resources/userService/login',
        {
            'email': "tim.ameye@student.kuleuven.be",
            'password': "test123"
        },
        function (token) {
            console.log(token);
        },
        'text'
    );

});