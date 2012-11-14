var EA = {

    showErrorDialog:function (message) {
        $('<div>').simpledialog2({
            mode:'button',
            headerText:'Error',
            headerClose:false,
            buttonPrompt:message,
            buttons:{
                'I understand':{
                    click:function () {
                        this.close();
                    }
                }
            }
        });
    }

};