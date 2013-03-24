//example at http://www.kendoui.com/blogs/teamblog/posts/12-03-09/bind_this_a_look_at_kendo_ui_mvvm.aspx
var viewModel = kendo.observable({

    // expenses array will hold the grid values
    expenses: [],

    // the values are bound to the merchant and amount fields
    date: new Date(),
    //projectCode: null,
    expenseTypeId: null,
    amount: null,
    //currency: null,
    remarks: null,
    expenseLocationId: 1,

    // event execute on click of add button
    create: function(e) {
        console.log(e);
        // add the items to the array of expenses
        this.get("expenses").push({
            date: kendo.toString(this.get("date"),"dd/MM/yyyy"),
            //projectCode: this.get("projectCode"),
            expenseTypeId: this.get("expenseTypeId"),
            amount: this.get("amount"),
            //currency: this.get("currency"),
            remarks: this.get("remarks")
        }),
        // TODO reset the form
        console.log( this.get("expenses"));
    }

});

// apply the bindings
kendo.bind($("#addExpense"), viewModel);
kendo.bind($("#overview-list"), viewModel);
