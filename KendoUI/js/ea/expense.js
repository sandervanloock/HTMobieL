var viewModel = kendo.observable({

    // expenses array will hold the grid values
    expenses: [],

    // the values are bound to the merchant and amount fields
    //date: null,
    projectCode: null,
    //expenseTypeId: null,
    amount: null,
    //currency: null,
    remarks: null,
    //expenseLocationId: 1,

    // event execute on click of add button
    create: function(e) {

        // add the items to the array of expenses
        this.get("expenses").push({
            //date: this.get("date"),
            projectCode: this.get("projectCode"),
            //expenseTypeId: this.get("expenseTypeId"),
            amount: this.get("amount"),
            //currency: this.get("currency"),
            remarks: this.get("remarks")
        }),
        // reset the form
        //this.set("expenseType", "food");
        //this.set("date", "");
        this.set("projectCode", "");
        //this.set("expenseTypeId", "");
        this.set("amount", "");
        //this.set("currency", "");
        //this.set("remarks", "");
        console.log( this.get("expenses"));
    }

});

// apply the bindings
kendo.bind($("#addExpense"), viewModel);
kendo.bind($("#overview-list"), viewModel);
