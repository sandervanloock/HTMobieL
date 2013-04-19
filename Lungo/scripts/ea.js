var EA = {

    baseURL: "http://kulcapexpenseapp.appspot.com/",
//    baseURL:"http://localhost:8888/",
//    baseURL:"http://192.168.1.11:8888/",

    toBelgianDate: function (date) {
        // get properties
        var dd = date.getDate();
        var mm = date.getMonth();

        // January is 0, so plus 1
        mm += 1;

        // Leading zeros
        if (dd < 10) {
            dd = "0" + dd;
        }
        if (mm < 10) {
            mm = "0" + mm;
        }

        return dd + "/" + mm + "/" + date.getFullYear();
    },

    expenseTypeIdToString: function (id) {
        if (id == 1) {
            return "Hotel";
        } else if (id == 2) {
            return "Lunch";
        } else if (id == 3) {
            return "Diner";
        } else if (id == 4) {
            return "Ticket";
        } else if (id == 5) {
            return "Restaurant";
        } else if (id == 6) {
            return "Other";
        } else {
            return "ERROR_TYPE";
        }
    },

    expenseStatusIdToString: function (id) {
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
    },

    convertToEuro: function (amount, currency) {
        var rate = this.getRateForCurrency(currency);
        var converted = amount / rate;
        return converted.toFixed(2);
    },

    getRateForCurrency: function (currency) {
        var currencies = Lungo.Data.Storage.persistent("currencies");
        var toReturn = null;
        // loop over all currency entries
        $$(currencies).each(function (i, cur) {
            if (cur.name === currency) {
                toReturn = cur.rate;
            }
        });
        return toReturn;
    },

    base64Prefix: "data:image/png;base64,",

    base64WithoutPrefix: function (string) {
        return string.substring(this.base64Prefix.length);
    },

    base64WithPrefix: function (string) {
        return this.base64Prefix + string;
    },

    getLocalExpenseById: function (id) {
        var expenses = Lungo.Core.toArray(Lungo.Data.Storage.persistent("localExpenses"));
        for (var i = 0; i < expenses.length; i++) {
            if (expenses[i].id === id) {
                return expenses[i];
            }
        }
        return null;
    },

    formatEuro: function (amount) {
        var converted = Number(amount);
        return "€ " + converted.toFixed(2);
    },

    sortExpensesAscending: function (a, b) {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return (dateA - dateB);
    },

    sortExpensesDescending: function (a, b) {
        var dateA = new Date(a.date);
        var dateB = new Date(b.date);
        return (dateB - dateA);
    }

};