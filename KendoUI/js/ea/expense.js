//example at http://www.kendoui.com/blogs/teamblog/posts/12-03-09/bind_this_a_look_at_kendo_ui_mvvm.aspx
var expenseForm = kendo.observable({

    // expenses array will hold the grid values
    expenses:
    [
        {
            date: kendo.toString(new Date(),"dd/MM/yyyy"),
            amount: 50,
            currency: "USD",
            rate: 1,
            expenseId: 0,
            remarks: "test",
            expenseTypeId: 5,
            projectCode: "GZ0565"
        }
    ],

    // type array populates the drop down
    //type: [{ name: "Food", value: "food"}, { name: "Clothing", value: "clothing"}, { name: "Bills", value: "bills" }],

    // expenseType holds the currently selected value of the dropdown list
    //expenseType: "food",

    // the values are bound to the merchant and amount fields
    date: new Date(),
    projectCode: null,
    expenseTypeId: null,
    amount: null,
    currency: null,
    rate: null,
    remarks: null,
    expenseLocationId: 1,

    // event execute on click of add button
    create: function(e) {
        //console.log($("#expense-evidence").data("kendoUpload"));
        this.get("expenses").push({
            date: kendo.toString(this.get("date"),"dd/MM/yyyy"),
            projectCode: this.get("projectCode"),
            expenseTypeId: this.get("expenseTypeId"),
            amount: this.get("amount"),
            currency: this.get("currency").get("currency"),
            rate: this.get("currency").get("rate"),
            remarks: this.get("remarks"),
            expenseLocationId: this.get("expenseLocationId"),
            expenseId: this.get("expenses").length
        });
        //TODO reset the form
        kendo.bind($("#overview-list"),expenseForm);
    }

});

kendo.bind($('#newExpense'), expenseForm);

function convertCurrencyToEuro(curr,value,rate){
    if(curr=="EUR")
        return value;
    else{
        var newAmount = value / rate;
        newAmount = Math.round(newAmount*100)/100;
        return newAmount;
    }
}

function showExpenseDetail(e) {
    var expense = expenseForm.expenses[e.view.params.expenseId];
    var expense = kendo.observable({
        date: expense.date,
        projectCode: expense.projectCode,
        expenseTypeId: expense.expenseTypeId,
        amount:expense.amount,
        currency: expense.currency,
        remarks: expense.remarks
    })
    kendo.bind($("#detail-expense-form"),expense);

}