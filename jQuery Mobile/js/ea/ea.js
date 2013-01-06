var EA = {

        /**
         * Acces token
         */

        token:null,

        getToken:function () {
            if (Modernizr.sessionstorage) {
                return sessionStorage.token;
            } else {
                return this.token;
            }
        },

        setToken:function (token) {
            console.log("User was logged in successfully: " + token);
            if (Modernizr.sessionstorage) {
                console.log("Using session storage");
                sessionStorage.token = token;
            } else {
                console.log("Not using session storage");
                this.token = token;
            }
        },

        isLoggedIn:function () {
            return this.getToken() != null;
        },

        redirectNotLoggedIn:function () {
            console.log("User is not logged in. Redirecting to login page.");
            $.mobile.changePage("#login");
        },

        /**
         * Project codes
         */

        projectCodeSuggestions:[],

        /**
         * Currencies
         */

        currencies:[],

        /**
         * Expenses
         */

        localExpenses:[],

        addLocalExpense:function (expense) {
            if (Modernizr.localstorage) {
                console.log("Using local storage");
                var lastId = localStorage.length;
                localStorage['expense' + lastId] = JSON.stringify(expense);
            } else {
                console.log("Not using local storage");
                this.localExpenses.push(expense);
            }
        },

        getLocalExpenses:function () {
            if (Modernizr.localstorage) {
                var toReturn = [];
                for (var i = 0; i < localStorage.length; i++) {
                    // http://stackoverflow.com/questions/3138564/looping-through-localstorage-in-html5-and-javascript
                    toReturn.push(JSON.parse(localStorage.getItem(localStorage.key(i))));
                }
                return toReturn;
            } else {
                return this.localExpenses;
            }
        },

        sortExpensesAscending:function (a, b) {
            var dateA = new Date(a.date);
            var dateB = new Date(b.date);
            return (dateA - dateB);
        },

        sortExpensesDescending:function (a, b) {
            var dateA = new Date(a.date);
            var dateB = new Date(b.date);
            return (dateB - dateA);
        },

        toBelgianDate:function (date) {
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

        expenseTypeIdToString:function (id) {
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

        expenseStatusIdToString:function (id) {
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

        /**
         * Message dialogs
         */

        showError:function (title, html) {
            $("#error-title").text(title);
            $("#error-message").html(html);
            $.mobile.changePage("#error");
        },

        showBackendError:function (message) {
            this.showError("Backend error", message);
        },

        prepareValidationError:function (validator, errorMap) {
            $("#error-validation-message").text("Please complete the following "
                + validator.numberOfInvalids()
                + " field(s):");

            var html = "";
            $.each(errorMap, function (index, value) {
                html += "<li>";
                html += index + ": " + value;
                html += "</li>";
            });
            $("#error-validation-items").html(html);

            validator.defaultShowErrors();
        }

    }
    ;