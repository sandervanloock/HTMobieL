var Expense = kendo.data.Model.define( {
    id: "expenseId",
    expenses: [],
    fields :
    {
        "expenseTypeId":{
            type : 'number'
        },
        "expenseLocationId": {
            type : 'number'
        },
        "date" :{
            type : 'date'
        },
        "projectCode": {
            type : 'number'
        },
        "currency": {
            type : 'string'
        },
        "amount": {
            type : 'number'
        },
        "remarks": {
            type : 'string'
        },
        "evidence" : {
            type: 'string'
        }
    },
    create: function(e){
        // add the items to the array of expenses
        console.log(this);
        this.get("expenses").push({
            //expenseTypeId: this.get("expenseType"),
            expenseLocationId: this.get("expenseLocationId"),
            date: this.get("date"),
            projectCode: this.get("projectCode"),
            currency: this.get("currency"),
            amount: this.get("amount"),
            remarks: this.get("remarks")
        });
        console.log(this.get("expenses"));
        // reset the form TODO
        /*this.set("expenseType", "food");
        this.set("merchant", "");
        this.set("amount", "");*/
    }

});

var viewModel = kendo.observable({

    // expenses array will hold the grid values
    expenses: [],

    // type array populates the drop down
    //type: [{ name: "Food", value: "food"}, { name: "Clothing", value: "clothing"}, { name: "Bills", value: "bills" }],

    // expenseType holds the currently selected value of the dropdown list
    //expenseType: "food",

    // the values are bound to the merchant and amount fields
    merchant: null,
    amount: null,

    // event execute on click of add button
    create: function(e) {

        // add the items to the array of expenses
        this.get("expenses").push({
            //Type: this.get("expenseType"),
            Merchant: this.get("projectCode"),
            Amount: this.get("amount")});

        // reset the form
        //this.set("expenseType", "food");
        this.set("projectCode", "");
        this.set("amount", "");
        console.log( this.get("expenses"));
    }

});

// apply the bindings
kendo.bind($("#addExpense"), viewModel);
kendo.bind($("#overview-list"), viewModel);
