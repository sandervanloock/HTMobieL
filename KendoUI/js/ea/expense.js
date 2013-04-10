//example at http://www.kendoui.com/blogs/teamblog/posts/12-03-09/bind_this_a_look_at_kendo_ui_mvvm.aspx
var expenseForm = kendo.observable({
    // expenses array will hold the grid values
    expenses:
    [
        {
            date: kendo.toString(new Date(),"dd/MM/yyyy"),
            amount: 50,
            currency: "EUR",
            rate: 1,
            expenseId: 0,
            remarks: "test",
            expenseTypeId: 5,
            projectCode: "GZ0565",
            expenseLocationId: 1
        },
        {
            date: kendo.toString(new Date(),"dd/MM/yyyy"),
            amount: 100,
            currency: "USD",
            rate: 1.5,
            expenseId: 1,
            remarks: "test",
            expenseTypeId: 1,
            projectCode: "GZ0565",
            expenseLocationId: 2
        }
    ],

    // the values are bound to the merchant and amount fields
    date: new Date(),
    projectCode: null,
    expenseTypeId: 1, //Hotel is initially checked
    amount: null,
    currency: null,
    rate: null,
    remarks: null,
    expenseLocationId: 1,

    // event execute on click of add button
    create: function(e) {
        //console.log($("#expense-evidence").data("kendoUpload"));
        var validator = $("#addExpense").kendoValidator().data("kendoValidator");
        //Validator voor 'other' validatie wordt enkel op radiobuttons met value 6 gecontroleerd
        //Omdat de errormessage enkel aan het eerste veld wordt toegekend moeten de radios van beide
        //types appart worden gechecked
        var otherSelector =  expenseForm.get("expenseLocationId") == 1 ? $("#new-abroad-expense [type='radio'][value='6']") : $("#new-domestic-expense [type='radio'][value='6']");
        var otherValidator = otherSelector.kendoValidator({
            rules: {
                other: function (e) {
                    if(e.is(':checked')){
                        var remarks = expenseForm.get("expenseLocationId") == 1 ? $("#abroad-expense-remarks").val() : $("#domestic-expense-remarks").val();
                        return  remarks != "";
                    }
                    return true;
                }
            },
            messages: {
                other: "Remarks must be filled in"
            }
        }).data("kendoValidator");
        if(this.get("expenseLocationId")==2){
            /*If expenseLocationId is 2,  we have a domestic expense
            * Set the currency to EUR en rate to 1 and
            * change the validator to the domestic expense form
            * */
            this.set("currency",{
                currency: "EUR",
                rate: 1
            });
            validator = $("#new-domestic-expense").kendoValidator().data("kendoValidator");
        }
        /*
        * Validaties moeten appart uitgevoerd worden owv lazy evaluation.
        * Beide methodeoproepen in IF-statements zetten roept tweede niet op als eerste FALSE teruggeeft
        * */
        var v1 = validator.validate();
        var v2 = otherValidator.validate();
        if (v1 && v2){
            this.get("expenses").push({
                date: kendo.toString(this.get("date"),"dd/MM/yyyy"),
                projectCode: this.get("projectCode"),
                expenseTypeId: this.get("expenseTypeId"),
                amount: this.get("amount"),
                currency: this.get("currency").get("currency"),
                rate: this.get("currency").get("rate"),
                remarks: this.get("remarks"),
                expenseLocationId: this.get("expenseLocationId"),
                expenseId: this.get("expenses").length //Id voor ophalen van expense bij overview
            });
            //reset the form
            this.set("date",new Date());
            this.set("projectCode",null);
            this.set("expenseTypeId",1);
            this.set("amount",null);
            this.set("currency",null);
            this.set("rate",null);
            this.set("remarks",null);
        } else
            EA.showError(validator.errors().concat(otherValidator.errors()));
    }

});

function submitExpense(){
    //TODO validate
    console.log(expense);
}

function convertCurrencyToEuro(curr,value,rate){
    if(curr=="EUR")
        return value;
    else{
        var newAmount = value / rate;
        newAmount = Math.round(newAmount*100)/100;
        return newAmount;
    }
}

var expenseMV = kendo.observable();

function showExpenseDetail(e) {
    var expense = expenseForm.expenses[e.view.params.expenseId];
    var listviews = this.element.find("ul.km-listview");
    $("#overview-location-button").kendoMobileButtonGroup({
        select: function(e) {
            //TODO button group klikken wijzigt geselecteerde knop niet!
        },
        index: expense.expenseLocationId-1 //1 = DOMESTIC, 2 = ABROAD
    });
    /*
        De content van de tab die hoort bij de geselecteerde index ophalen door de index
        te zetten of $("#overview-location-button").data("kendoMobileButtonGroup").select(...)
        op te roepen werkt niet.
        via jQuery code expliciet zeggen welke view toonbaar moet zijn!
    */
    listviews.hide().eq(expense.expenseLocationId-1).show();
    expenseMV.set("date",expense.date);
    expenseMV.set("projectCode", expense.projectCode);
    expenseMV.set("expenseTypeId", expense.expenseTypeId);
    expenseMV.set("amount",expense.amount);
    expenseMV.set("currency", expense.currency);
    expenseMV.set("remarks", expense.remarks);
}

$(document).on("click", "[id^=my-expenses-show-pdf]", function () {
    if (navigator.onLine) {
        var $hiddenForm = $('#my-expenses-form');

        var url = EA.baseURL + "resources/expenseService/getExpenseFormPDF";
        $hiddenForm[0].setAttribute('action', url);

        // get the id of the form that is requested
        var expenseFormId = $(this).attr("id").replace("my-expenses-show-pdf-", "");
        // guideline: AJAX is not for fetching raw data like a PDF.
        // to accomplish this, a hidden form is used and the requested data is
        // copied into that hidden form
        $("#my-expenses-token").val(EA.getToken());
        $("#my-expenses-form-id").val(expenseFormId);

        // submit that hidden form so the PDF will be downloaded
        $hiddenForm.submit();
    }
});

function expenseStatusIdToString(id) {
    if (id == 1) {
        return "New";
    } else if (id == 2) {
        return "Verified";
    } else if (id == 3) {
        return "Approved";
    } else if (id == 4) {
        return "Paid out";
    } else if (id == 5) {
        return "Disapproved";
    } else {
        return "ERROR_STATUS";
    }
}