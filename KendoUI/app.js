function gotoOverview(){
    var validator = $("#yourInfo").kendoValidator().data("kendoValidator");
    if (validator.validate()) //A valid employee is filled in
        $("#main-pane").data("kendoMobilePane").navigate("#overview");
    else
        EA.showError(validator.errors());
}

/*
* Sluit de popup
* */
function closeModalView(e) {
    // find the closest modal view, relative to the button element.
    var modalView = e.sender.element.closest("[data-role=modalview]").data("kendoMobileModalView");
    modalView.close();
}

function gotoNewExpenseForm(){
    if(isPhone)
        app.navigate("#side-root");
    else
        app.navigate("#newExpense");
}

/*
* Datasources
*/

var expenseFormDataSource = new kendo.data.DataSource({
    transport: {
        read: {
            url: EA.baseURL + "resources/expenseService/getExpenseForms",
            dataType: "xml",
            type: "POST",
            complete: function(jqXHR, textStatus){
                //app.hideLoading()
            }
        },
        parameterMap: function(options) {
            return {
                token: EA.getToken()
            };
        }
    },
    schema: {
        type: "xml",
        data: "expenseForms/expenseForm", // the data which the data source will be bound to is in the "results" field
        model: {
            fields: {
                id: "id/text()",
                date: "date/text()",
                statusId: "statusId/text()"
            }
        }
    }
});

var currencySource = new kendo.data.DataSource({
    transport: {
        read: {
            url:  EA.baseURL + "resources/currencyService/getCurrencies",
            dataType: "xml",
            type:"POST"
        }
    },
    schema: { // describe the result format
        type: "xml",
        data: "/gesmes:Envelope/Cube/Cube/Cube", // the data which the data source will be bound to is in the "results" field
        model: {
            // configure the fields of the object
            fields: {
                currency: "@currency",
                rate: "@rate"
            }
        }
    }
});

/*
* Initialization methods
*/

function yourInfoViewInit(){
    var currDate = new Date(new Date().getFullYear(),new Date().getMonth(),1);
    if(new Date().getUTCDate()<15)
        currDate.setDate(currDate.getDate()-30);
    $("#your-info-date").kendoDatePicker({
        // defines the start view
        start: "year",
        // defines when the calendar should return date
        depth: "year",
        value: currDate,
        // display month and year in the input
        format: "MMMM yyyy"
    });
}


function overviewInit(){
    var expenseDataSource = new kendo.data.DataSource.create({data: expenseForm.get("expenses")});
    $("#overview-list").kendoMobileListView({
        dataSource: expenseDataSource,
        template: $("#overview-template").text()
    });
};

function addExpenseViewInit(e) {
    e.view.useNativeScrolling = true; //TODO TESTEN scrolling

    //Necessary for the Abroad / Domestic switch (found in examples)
    var listviews = this.element.find("ul.km-listview");
    $("#expense-location-button").kendoMobileButtonGroup({
        select: function(e) {
            listviews.hide().eq(this.selectedIndex).show();
            //var newlocation = expenseForm.get("expenseLocationId") == this.selectedIndex;
            expenseForm.set("expenseLocationId",this.selectedIndex+1);
        },
        index: expenseForm.get("expenseLocationId")-1
    });

    //Date picker from now till two months earlier
    var startDate = new Date();
    startDate.setDate(startDate.getDate()-60);
    $("#abroad-expense-date").kendoDatePicker({
        value: new Date(),
        min: startDate,
        max: new Date(),
        format: "dd/MM/yyyy"
    });
    $("#domestic-expense-date").kendoDatePicker({
        value: new Date(),
        min: startDate,
        max: new Date(),
        format: "dd/MM/yyyy"
    });

    $("#abroad-expense-project-code").kendoAutoComplete({
        placeholder: 'Project Code',
        dataSource: new kendo.data.DataSource({
            type: "json", // specifies data protocol
            transport: {
                read: {
                    url:  EA.baseURL + "/resources/expenseService/getProjectCodeSuggestion",
                    type: "POST"
                },
                parameterMap: function(options) {
                    return {
                        keyword: $("#abroad-expense-project-code").val()
                    };
                }
            },
            schema: { // describe the result format
                type: "json",
                data: "data"
            }
        })
    });

    $("#domestic-expense-project-code").kendoAutoComplete({
        placeholder: 'Project Code',
        dataSource: new kendo.data.DataSource({
            type: "json", // specifies data protocol
            transport: {
                read: {
                    url:  EA.baseURL + "/resources/expenseService/getProjectCodeSuggestion",
                    type: "POST"
                },
                parameterMap: function(options) {
                    return {
                        keyword: $("#domestic-expense-project-code").val()
                    };
                }
            },
            schema: { // describe the result format
                type: "json",
                data: "data"
            }
        })
    });

    $("#abroad-expense-currency").kendoDropDownList({
        index: 0,
        dataSource: currencySource,
        dataTextField: "currency",
        dataValueField: "rate",
        optionLabel: "Currency"
    });

    $("#domestic-expense-currency").kendoDropDownList({
        index: 0,
        dataSource: currencySource,
        dataTextField: "currency",
        dataValueField: "rate",
        optionLabel: "Currency"
    });

    $("#abroad-expense-evidence").kendoUpload({
        multiple: false
    });

    $("#domestic-expense-evidence").kendoUpload({
        multiple: false
    });
}

function signAndSendViewInit(){
    // when this line is in pagebeforeshow, it cannot know
    // width and heigh of the page, therefore it is placed here, but
    // because this code is executed everytime the page is viewed,
    // multiple signature fields would come up,
    // so we just check if the canvas is there or not
    if (  $("#sign-and-send-signature").find("canvas").length == 0) {
        $("#sign-and-send-signature").jSignature();
    }
}

function initExpenseFormOverview() {
    $("#expenseFormList").kendoMobileListView({
        dataSource: expenseFormDataSource,
        pullToRefresh: true,
        template: $("#expenseForm-template").text()
    });

};