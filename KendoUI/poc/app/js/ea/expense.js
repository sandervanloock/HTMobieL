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

    create: function(e) {
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
            var newExpense = {
                date: this.get("date"),
                projectCode: this.get("projectCode"),
                currency: this.get("currency").get("currency"),
                amount: this.get("amount"),
                remarks: this.get("remarks"),
                expenseTypeId: this.get("expenseTypeId"),
                expenseLocationId: this.get("expenseLocationId"),
                rate: this.get("currency").get("rate"),
                evidence: EA.getEvidence()
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
            this.set("remarks","");
            //clear the evidence image http://www.telerik.com/community/forums/aspnet-mvc/upload/programmatically-remove-clear-uploaded-files.aspx
            var canvas = $('#expense-evidence-canvas')[0];
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            EA.clearEvidence();
        } else
            EA.showError(validator.errors().concat(otherValidator.errors()));
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
                $("#overview-list").html("<li>No expenses submitted</li>");
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
    $("#expense-evidence-img").attr("src", EA.base64WithPrefix(expense.evidence));
}
