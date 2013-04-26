function gotoOverview(){
    validateEmployee();
    if(isPhone)
        app.navigate("#overview");
    else
        $("#main-pane").data("kendoMobilePane").navigate("#overview");
}

function validateEmployee(){
    var validator = $("#yourInfo").kendoValidator().data("kendoValidator");
    if(!validator.validate()){
        EA.showError(validator.errors());
        if(isPhone)
            app.navigate("#yourInfo");
        else
            $("#main-pane").data("kendoMobilePane").navigate("#yourInfo");
    }
}

/*
* Sluit de popup
* */
function closeModalView(e) {
    // find the closest modal view, relative to the button element.
    var modalView = e.sender.element.closest("[data-role=modalview]").data("kendoMobileModalView");
    modalView.close();
}

function clearSavedExpenses(e){
    var modalView = e.sender.element.closest("[data-role=modalview]").data("kendoMobileModalView");
    localStorage.removeItem("expenses");
    modalView.close();
}

function gotoNewExpenseForm(){
    if(Modernizr.localstorage && localStorage.getItem("expenses")!=null){
        var modalView = $("#confirmation").data("kendoMobileModalView");
        modalView.open();
    }
    if(isPhone)
        app.navigate("#side-root");
    else
        app.navigate("#newExpense");
}

var expenseFormDataSource = new kendo.data.DataSource({
    transport: {
        read: function(options){
            app.showLoading();
            $.ajax({
                url: EA.baseURL + "resources/expenseService/getExpenseForms",
                dataType: "xml",
                type: "POST",
                data: {
                    token: EA.getToken()
                },
                success: function(result,textstatus,jqXHR) {
                    // notify the data source that the request succeeded
                    if(jqXHR.status==204){
                        options.success("<expenseForms></expenseForms>");
                        $("#expenseFormList").html("<li>No expenses submitted</li>");
                    }
                    else
                        options.success(result);
                },
                error: function(result) {
                    // notify the data source that the request failed
                    options.error(result);
                },
                complete: function(jqXHR, textStatus){
                    app.hideLoading();

                }
            })
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
    },
    sort: {field: "date", dir: "desc"}
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

/***************************/
/* Initialization methods  */
/***************************/
function loginInit(){
    if(EA.hasUser())
        app.navigate("#home");
}

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
    $("#overview-list").kendoMobileListView({
        dataSource: expenseDataSource,
        template: $("#overview-template").text()
    });
};

function overviewShow(){
    expenseDataSource.read();
};

function addExpenseViewInit(e) {
    //Necessary for the Abroad / Domestic switch (found in examples)
    var listviews = this.element.find("ul.km-listview");
    $("#expense-location-button").kendoMobileButtonGroup({
        select: function(e) {
            listviews.hide().eq(this.selectedIndex).show();
            expense.set("expenseLocationId",this.selectedIndex+1);
        },
        index: expense.get("expenseLocationId")-1
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
        ignoreCase: true,
        dataSource: new kendo.data.DataSource({
            serverFiltering: true,
            type: "json", // specifies data protocol
            transport: {
                read: function(options) {
                    // make JSONP request to http://demos.kendoui.com/service/products
                    $.ajax( {
                        url:  EA.baseURL + "resources/expenseService/getProjectCodeSuggestion",
                        dataType: "json",
                        type: "POST",
                        data: {
                            keyword: $("#abroad-expense-project-code").val()
                        },
                        success: function(result) {
                            // notify the data source that the request succeeded
                            if(result==null)
                                options.success({data: []});
                            else
                                options.success(result);
                        },
                        error: function(result) {
                            // notify the data source that the request failed
                            options.error(result);
                        }
                    });
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
        ignoreCase: true,
        dataSource: new kendo.data.DataSource({
            serverFiltering: true,
            type: "json", // specifies data protocol
            transport: {
                read: function(options) {
                    // make JSONP request to http://demos.kendoui.com/service/products
                    $.ajax( {
                        url:  EA.baseURL + "resources/expenseService/getProjectCodeSuggestion",
                        dataType: "json",
                        type: "POST",
                        data: {
                            keyword: $("#domestic-expense-project-code").val()
                        },
                        success: function(result) {
                            // notify the data source that the request succeeded
                            if(result==null)
                                options.success({data: []});
                            else
                                options.success(result);
                        },
                        error: function(result) {
                            // notify the data source that the request failed
                            options.error(result);
                        }
                    });
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

    $("#expense-evidence").kendoUpload({
        multiple: false,
        async: {
            saveUrl: "http://www.chiroelzestraat.be/chirojongens/uploads/thesis/save.php",
            removeFields: "evidences[]"
        },
        success: onFileUploadSuccess,
        complete: function(){
            $(".k-widget.k-upload").find("ul").remove();
            $(".k-widget.k-dropzone").remove();
        },
        localization: {
            select: "Upload Evidence"
        }
    });
}

function onFileUploadSuccess(e){
        // get the file
        var file = e.files[0].rawFile;
        if (window.FileReader) {
            // initialize reader
            var reader = new FileReader();
            // if the image was read, load it into the canvas
            reader.onload = function (e) {
                // get the canvas that is hidden on that page
                var canvas = $('#expense-evidence-canvas')[0];
                var context = canvas.getContext('2d');
                var img = new Image();
                // if the image is in canvas, get base64
                img.onload = function () {
                    // set canvas dimensions to image dimensions
                    canvas.width = this.width;
                    canvas.height = this.height;
                    // draw the image on the canvas
                    context.drawImage(this, 0, 0);
                    // get the base64 string
                    var base64 = EA.base64WithoutPrefix(canvas.toDataURL());

                    // this can fail due to limitations of browser storage
                    try {
                        EA.setEvidence(base64);
                    } catch (error) {
                        // TODO solve problem
                        EA.showDialog("Session storage exceeds the limit");
                    }

                    app.hideLoading();
                };
                img.src = e.target.result;
            };

            // read the image
            app.showLoading();
            reader.readAsDataURL(file);
        } else {
            EA.showDialog("FileReaderAPI not supported");
        }
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

function resetSignature(){
    $("#sign-and-send-signature").jSignature("reset");
}
