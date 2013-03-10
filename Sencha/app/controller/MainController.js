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
                            myinfo : 'infopanel'
						},
						control : {
							'button[action=home]' : {
								tap : 'goHome'
							},'button[action=newExpenseForm]' : {
								tap : 'gotoNewExpenseForm'
							}, 'button[action=newExpense]' : {
                                tap : 'gotoNewExpense'
                            },'button[action=showOverviewList]': {
                                tap: 'showOverviewList'
                            },'button[action=totaloverviewlist]' : {
								tap : 'showTotalOverviewList'
							}, 'button[action=showSingAndSend]' : {
                                tap : 'showSingAndSend'
                            }, 'button[action=menu]' : {
                                tap: 'showMenu'
                            }
						}

					},

					gotoNewExpenseForm: function(button, e, options){
                        if(Ext.getStore('expensestore').getCount() > 0 ){
                            Ext.Msg.show({
                                title: 'Existing form found',
                                message: 'Do you want to continue an existing form (not yet send to the server) ?',
                                width: 300,
                                buttons: [ Ext.MessageBox.YES, Ext.MessageBox.NO ],
                                fn: function(){
                                    if(arguments[0]=='no'){
                                        var expensestore = Ext.getStore('expensestore');
                                        expensestore.removeAll();
                                        expensestore.sync();
                                    }
                                }
                            });
                        }
						Ext.Viewport.setActiveItem(Ext.getCmp('viewport'));
                        this.getDetail().setActiveItem(0);
						Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(0),false,false);
					},

                    gotoNewExpense: function(button, e, options){
                        this.getDetail().setActiveItem(2);
                        Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(2),false,false);
                    },

                    showOverviewList: function(button, e, options){
                        //Reset red borders
                        Ext.getCmp('infofield').getItems().each(function(item,index,length){
                            item.removeCls('x-field-custom-error');
                        });

                        var employee = Ext.create(
                            'Expense.model.Employee',
                            this.getMyinfo().getValues());

                        var errors = employee.validate();
                        if(errors.isValid())
                        {
                            this.getDetail().setActiveItem(1);
                            Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(1),false,false);

                            //set expense form date
                            var myDate=new Date();
                            myDate.setFullYear(Ext.getCmp('year').getValue(),Ext.getCmp('month').getValue(),1);
                             getExpenseForm().set('date',myDate);
                            //encode currencies at runtime
                            Ext.getStore('expensestore').each(function(item,index,length){
                                encodeCurrency(item);
                            });
                        }
                        else {
                            var message = '';
                            errors.each(function(item, index, length){
                                console.log(item);
                                message = message + item.getMessage() + '<br>';
                                if(item.getField()!='evidence')
                                    Ext.getCmp('infofield').getComponent(item.getField()).addCls('x-field-custom-error');
                            });
                            Ext.Msg.show({
                                title: 'Error',
                                message: message,
                                width: 300,
                                buttons: Ext.MessageBox.OK
                            });
                        }
                    },
					
					showTotalOverviewList: function(button, e, options){
                        var expenseStore = Ext.getStore('expenseformstore');
                        expenseStore.getProxy().setExtraParams({
                            token:  getToken()
                        });
                        expenseStore.load();
						Ext.Viewport.setActiveItem(Ext.getCmp('totaloverviewlist'));
					},

					goHome : function(button, e, options) {
						Ext.Viewport.setActiveItem(Ext.getCmp('home'));
					},

                    showSingAndSend : function(button, e, options) {
                        this.getDetail().setActiveItem(3);
                        Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(3),false,false);
                    },

                    showMenu: function(button, e, options){
                        Ext.getCmp('page').setHidden(true);
                        Ext.getCmp('menupanel').setHidden(false);
                    }
				});
