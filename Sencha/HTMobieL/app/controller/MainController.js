Ext
		.define(
				'Expense.controller.MainController',
				{
					extend : 'Ext.app.Controller',

					config : {

						refs : {
							detail : 'page',
							abroadExpense: 'abroadexpense',
							domesticExpense: 'domesticexpense',
							signfield: 'singfield'
						},
						control : {
							'#logout' : {
								tap : 'doLogout'
							},'button[action=showExpenseOverview]' : {
								tap: 'showExpenseOverview'
							}, 'button[action=addExpense]' : {
								tap: 'addExpense'
							}, 'button[action=sign]': {
								tap: 'signAndSend'
							}, 'button[action=sendAbroadExpense]' : {
								tap: 'sendAbroadExpense'
							}, 'button[action=addDomesticExpense]' : {
								tap: 'sendDomesticExpense'
							}, 'button[action=sendExpenses]' : {
								tap: 'sendExpenses'
							}
						}

					},

					doLogout : function(button, e, options) {
						console.log('logout');
						Ext.getStore('employeestore').removeAll();
						Ext.Ajax.request({
									url : 'http://kulcapexpenseapp.appspot.com/resources/userService/logout', // TODO url
									method : 'POST',
									useDefaultXhrHeader : false, // http://stackoverflow.com/questions/10830334/ext-ajax-request-sending-options-request-cross-domain-when-jquery-ajax-sends-get
									params : {
										token : Expense.app.token
									},
									callback : function(options, success,response) {
										console.log(Ext.getStore(
												'employeestore').getCount());
										Ext.Viewport.setActiveItem(Ext
												.getCmp('loginpanel'));
									}
								});
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
					
					/*
					 * {
					 * 	"date":"2012-11-26T22:25:16.907Z",
					 * 	"employeeId":1,
					 * 	"remarks":"test general remark",
					 * 	"notification":true,
					 * 	"expenses":[{
					 * 			"date":"2012-10-23T22:00:00.000Z",
					 * 			"projectCode":"G20AERZ",
					 * 			"currency":"EUR",
					 * 			"amount":10.2,
					 * 			"remarks":"parking",
					 * 			"expenseTypeId":6,
					 * 			"expenseLocationId":1
					 * 			},{
					 * 			"date":"2012-10-11T22:00:00.000Z",
					 * 			"projectCode":"G35AERZ",
					 * 			"amount":250.5,
					 * 			"currency":"USD",
					 * 			"remarks":"hotel test",
					 * 			"expenseTypeId":1,
					 * 			"expenseLocationId":2}
					 * 	]
					 * }
					 */
					sendAbroadExpense: function(button, e, options){
						console.log(this.getAbroadExpense());
						var field = this.getAbroadExpense().getItems()[0];
						//TODO als JSON in store steken
						this.getDetail().setActiveItem(3); //TODO lijstselectie wijzigen
					},
					
					sendDomesticExpense: function(button, e, options){
						console.log(this.getDomesticExpense());
						var field = this.getDomesticExpense().getItems()[0];
						//TODO als JSON in store steken
						this.getDetail().setActiveItem(3); //TODO lijstselectie wijzigen
					},
					
					sendExpenses : function(button, e, options){
						this.getDetail().setActiveItem(0);//TODO
					}
				});