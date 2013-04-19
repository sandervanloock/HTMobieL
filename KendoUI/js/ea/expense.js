//example at http://www.kendoui.com/blogs/teamblog/posts/12-03-09/bind_this_a_look_at_kendo_ui_mvvm.aspx
var expense = kendo.observable({

    // the values are bound to the merchant and amount fields
    date: new Date(),
    projectCode: null,
    expenseTypeId: 1, //Hotel is initially checked
    amount: null,
    currency: null,
    rate: null,
    remarks: "",
    expenseLocationId: 1,
    evidence: "",

    create: function(e) {

        var fd = new FormData(document.getElementById("fileinfo"));
        //fd.append("files",);
        $.ajax({
            url: "save.php",
            type: "POST",
            data: fd,
            processData: false,  // tell jQuery not to process the data
            contentType: false,   // tell jQuery not to set contentType
            success: function(){
                console.log("success");
            },
            complete: function(){
                console.log("complete");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status);
                console.log(thrownError);
            }
        });

        //var validator = $("#addExpense").kendoValidator().data("kendoValidator");
        //Validator voor 'other' validatie wordt enkel op radiobuttons met value 6 gecontroleerd
        //Omdat de errormessage enkel aan het eerste veld wordt toegekend moeten de radios van beide
        //types appart worden gechecked
        /*var otherSelector =  expenseForm.get("expenseLocationId") == 1 ? $("#new-abroad-expense [type='radio'][value='6']") : $("#new-domestic-expense [type='radio'][value='6']");
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
            /*this.set("currency",{
                currency: "EUR",
                rate: 1
            });
            validator = $("#new-domestic-expense").kendoValidator().data("kendoValidator");
        }
        /*
        * Validaties moeten appart uitgevoerd worden owv lazy evaluation.
        * Beide methodeoproepen in IF-statements zetten roept tweede niet op als eerste FALSE teruggeeft
        * */
        /*var v1 = validator.validate();
        var v2 = otherValidator.validate();
        if (v1 && v2){
            var newExpense = {
                date: this.get("date"),
                projectCode: this.get("projectCode"),
                expenseTypeId: this.get("expenseTypeId"),
                amount: this.get("amount"),
                currency: this.get("currency").get("currency"),
                rate: this.get("currency").get("rate"),
                remarks: this.get("remarks"),
                evidence: this.get("evidence"),
                expenseLocationId: this.get("expenseLocationId")
            };
            if (Modernizr.localstorage) {
                console.log("local expenses written");
                var oldExpenses = localStorage.expenses==undefined ? [] : JSON.parse(localStorage.expenses);
                oldExpenses.push(newExpense);
                localStorage.setItem("expenses",JSON.stringify(oldExpenses));
            }
            expenseDataSource.add(newExpense);
            //reset the form
            this.set("date",new Date());
            this.set("projectCode",null);
            this.set("expenseTypeId",1);
            this.set("amount",null);
            this.set("currency",null);
            this.set("rate",null);
            this.set("remarks",null);
        } else
            EA.showError(validator.errors().concat(otherValidator.errors()));*/
    }

});

var expenseDataSource = new kendo.data.DataSource({
    sort: { field: "date", dir: "asc" },
    transport: {
        read: function(options){
            if (Modernizr.localstorage && localStorage.expenses != undefined) {
                console.log("local expenses read");
                options.success(JSON.parse(localStorage.expenses));
            } else {
                //Geen expenses => lege lijst teruggeven en tekst in lijst weergeven
                options.success([]);
                $("#overview-list").html("<h2>No expenses submitted</h2>");
            }
        }
    }
});

/*
* The expense viewed as detail expense in overview
*/
var expenseMV = kendo.observable();

function showExpenseDetail(e) {
    var expense = expenseDataSource.getByUid(e.view.params.expenseId);
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
    expenseMV.set("date",kendo.toString(new Date(Date.parse(expense.date)), "dd/MM/yyyy"));
    expenseMV.set("projectCode", expense.projectCode);
    expenseMV.set("expenseTypeId", expense.expenseTypeId);
    expenseMV.set("amount",expense.amount);
    expenseMV.set("currency", expense.currency);
    expenseMV.set("remarks", expense.remarks);
}
