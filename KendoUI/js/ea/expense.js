//example at http://www.kendoui.com/blogs/teamblog/posts/12-03-09/bind_this_a_look_at_kendo_ui_mvvm.aspx
var expenseForm = kendo.observable({

    // expenses array will hold the grid values
    expenses: [],

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
    remarks: null,
    expenseLocationId: 1,

    // event execute on click of add button
    create: function(e) {
        this.get("expenses").push({
            date: kendo.toString(this.get("date"),"dd/MM/yyyy"),
            projectCode: this.get("projectCode"),
            expenseTypeId: this.get("expenseTypeId"),
            amount: this.get("amount"),
            currency: this.get("currency").get("currency"),
            remarks: this.get("remarks"),
            expenseLocationId: this.get("expenseLocationId")
        });
        //TODO reset the form
        kendo.bind($("#overview-list"),expenseForm);
    }

});

kendo.bind($('#newExpense'), expenseForm);