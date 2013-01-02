Ext.define(
				'Expense.controller.MainController',
				{
					extend : 'Ext.app.Controller',
					
					require: [
					     'Expense.model.Expense'
					],

					config : {

						refs : {
							detail : 'page',
							abroadExpense: 'abroadexpense',
							domesticExpense: 'domesticexpense',
							signfield: 'singfield'	
						},
						control : {
							'button[action=logout]' : {
								tap : 'doLogout'
							},'button[action=home]' : {
								tap : 'goHome'
							},'button[action=newExpense]' : {
								tap : 'createNewExpense'
							},'button[action=totaloverviewlist]' : {
								tap : 'showOverviewList'
							},'button[action=showExpenseOverview]' : {
								tap: 'showExpenseOverview'
							}, 'button[action=addExpense]' : {
								tap: 'addExpense'
							}, 'button[action=sign]': {
								tap: 'signAndSend'
							}, 'button[action=sendAbroadExpense]' : {
								tap: 'sendAbroadExpense'
							}, 'button[action=sendDomesticExpense]' : {
								tap: 'sendDomesticExpense'
							}, 'button[action=sendExpenses]' : {
								tap: 'sendExpenses'
							}
						}

					},
					
					createNewExpense: function(button, e, options){
						Ext.Viewport.setActiveItem(Ext.getCmp('viewport'));
					},
					
					showOverviewList: function(button, e, options){
						Ext.Viewport.setActiveItem(Ext.getCmp('totaloverviewlist'));
					},

					doLogout : function(button, e, options) {
						console.log('logout');
						//Ext.getStore('employeestore').removeAll();
						Ext.Ajax.request({
							url : Expense.app.getBaseURL() + '/resources/userService/logout',
							method : 'POST',
							useDefaultXhrHeader : false, // http://stackoverflow.com/questions/10830334/ext-ajax-request-sending-options-request-cross-domain-when-jquery-ajax-sends-get
							params : {
								token : Expense.app.token
							},
							callback : function(options, success,response) {
								Ext.Viewport.setActiveItem(Ext.getCmp('loginpanel'));
							}
						});
					},
					

					goHome : function(button, e, options) {
						Ext.Viewport.setActiveItem(Ext.getCmp('home'));
					},

					showExpenseOverview : function(button, e, options) {
						this.getDetail().setActiveItem(1); //TODO lijstselectie wijzigen
						// TODO expenses from store
					},
					
					addExpense : function(button, e, options){
						this.getDetail().setActiveItem(2);
						Ext.getCmp('menulist').setActiveItem(2); //TODO lijstselectie wijzigen
					},
					
					signAndSend: function(button, e, options){
						this.getDetail().setActiveItem(3); //TODO lijstselectie wijzigen
					},
					
					sendAbroadExpense: function(button, e, options){
						var expense = Ext.create(
								'Expense.model.Expense',
								this.getAbroadExpense().getValues());
						var errors = expense.validate();
						if(errors.isValid())
						{
							Ext.getStore('expensestore').add(expense);
							/*Expense.app.getEmployee().expenses().add(expense);*/
							this.getDetail().setActiveItem(3); //TODO lijstselectie wijzigen
						} else
							console.log("expense not valid");
						
					},
					
					sendDomesticExpense: function(button, e, options){
						var expense = Ext.create(
								'Expense.model.Expense',
								this.getDomesticExpense().getValues());
						var errors = expense.validate();
						if(errors.isValid())
						{
							/*var expenses = Expense.app.getEmployee().expenses();
							expenses.add(expense);
							expenses.sync();*/
							Ext.getStore('expensestore').add(expense);
							this.getDetail().setActiveItem(3); //TODO lijstselectie wijzigen
						} else
							console.log("expense not valid");
						
					},

					
					sendExpenses : function(button, e, options){
						var field = this.getSignfield().getValues();
						var sendObject = new Object();
						sendObject.date = new Date();
						sendObject.employeeId = Expense.app.getEmployee().get('id'); 
						sendObject.remarks = field['remarks']; 
						sendObject.notification = field['notification'];
						//var expenses = new Array();
						var expenses =  Ext.getStore('expensestore').getData();
						console.log(expenses);
						//sendObject.expenses = expenses;//Expense.app.getEmployee().expenses();
						var result = JSON.stringify(sendObject);
						result.expenses = expenses;
						console.log(result);
						/*field.submit({
							url : Expense.app.getBaseURL() + '/resources/expenseService/saveExpense',
							 method: 'POST',
							    success: function() {
							        alert('form submitted successfully!');
							    }
							
						});*/
						this.getDetail().setActiveItem(0);//TODO
					}
				});