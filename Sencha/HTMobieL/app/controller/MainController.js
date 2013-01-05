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
							infoPanel: 'infopanel',
							abroadExpense: 'abroadexpense',
							domesticExpense: 'domesticexpense',
							signfield: 'singfield',
							fileBtn: '#fileBtn',
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
							}, fileBtn: {
				                initialize: 'onFileBtnInit'
				            }
						}

					},
					
					createNewExpense: function(button, e, options){
						Ext.Viewport.setActiveItem(Ext.getCmp('viewport'));
						Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(0),false,false);
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
						var employee = Ext.create(
								'Expense.model.Employee',
								this.getInfoPanel().getValues());
						var errors = employee.validate();
						if(errors.isValid())
						{
							this.getDetail().setActiveItem(1);
							Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(1),false,false);
							/*for(var i =0;i<Ext.getCmp('infofield').items.length;i++)
								Ext.getCmp('infofield').getItems()[i].setCls(Ext.getCmp('infofield').getItems()[i].getBaseCls);*/
							Ext.getCmp('infofield').reset();
						} else{
							var message = '';
							errors.each(function(item, index, length){
								console.log(Ext.getCmp('infofield').getComponent(item.getField()));
								message = message + item.getField() + ' ' + item.getMessage() + '\n\n'; 
								Ext.getCmp('infofield').getComponent(item.getField()).setStyle('border-color: red; border-style: solid;');
							});
							Ext.Msg.show({
								   title: 'Error',
								   message: message,
								   width: 300,
								   buttons: Ext.MessageBox.OK
							});
						}
					},
					
					addExpense : function(button, e, options){
						this.getDetail().setActiveItem(2);
						Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(2),false,false);
					},
					
					signAndSend: function(button, e, options){
						this.getDetail().setActiveItem(3);
					},
					
					sendAbroadExpense: function(button, e, options){
						var expense = Ext.create(
								'Expense.model.Expense',
								this.getAbroadExpense().getValues());
						var errors = expense.validate();
						if(errors.isValid())
						{
							console.log(expense);
							Ext.getStore('expensestore').add(expense);
							/*Expense.app.getEmployee().expenses().add(expense);*/
							this.getDetail().setActiveItem(3);
							Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(3),false,false);
						} else{
							var message = '';
							errors.each(function(item, index, length){
								message = message + item.getField() + ' ' + item.getMessage() + '\n\n'; 
								Ext.getCmp('abroadfield').getComponent(item.getField()).setStyle('border-color: red; border-style: solid;');
							});
							Ext.Msg.show({
								   title: 'Error',
								   message: message,
								   width: 300,
								   buttons: Ext.MessageBox.OK
							});
						}
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
							this.getDetail().setActiveItem(3);
							Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(3),false,false);
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
						this.getDetail().setActiveItem(0);
						Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(0),false,false);
					},
					
					onFileBtnInit: function(fileBtn) {
				        var me = this;				        
				        fileBtn.setCallbacks({
				            scope: me,
				            success: me.onFileUploadSuccess,
				            failure: me.onFileUploadFailure
				        });
				    },
				});
