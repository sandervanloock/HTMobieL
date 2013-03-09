
Ext.define('Expense.controller.ExpenseController', {
    extend: 'Ext.app.Controller',
    alias: 'controller.expensecontroller',

    requires: [
        'Ext.Img'
    ],

    config: {
        refs: {
            nav: 'overview',
            infoPanel: 'infopanel',
            abroadExpense: 'abroadexpense',
            domesticExpense: 'domesticexpense',
            detail : 'page',
            signfield: 'signfield',
            fileLoadAbroad: '#fileLoadAbroad',
            fileLoadDomestic: '#fileLoadDomestic',
            loadedImageAbroad: '#loadedImageAbroad',
            loadedImageDomestic: '#loadedImageDomestic'
        },

        control: {
            "#overviewlist": {
                disclose: 'showDetailExpense',
                painted: 'decodeCurrencies'
            }, "#totaloverviewlist": {
            	disclose: 'showExpensePDF'
            }, 'button[action=showExpenseOverview]' : {
                tap: 'showExpenseOverview'
            }, 'button[action=sendAbroadExpense]' : {
                tap: 'sendAbroadExpense'
            }, 'button[action=sendDomesticExpense]' : {
                tap: 'sendDomesticExpense'
            },'button[action=sendExpenses]' : {
                tap: 'sendExpenses'
            }, 'abroadexpense textfield[itemId=projectCodeAbroad]' : {
                //clear the input text box
                clearicontap : 'onClearSearch',
                //on every key stroke
                keyup: 'onSearchKeyUp'
            },'domesticexpense textfield[itemId=projectCodeDomestic]' : {
                //clear the input text box
                clearicontap : 'onClearSearch',
                //on every key stroke
                keyup: 'onSearchKeyUp'
            },'projectcodelist': {
                itemtap: 'onSelectRow'
            },fileLoadAbroad: {
                loadsuccess: 'onFileUploadAbroadSuccess',
                loadfailure: 'onFileUploadFailure'
            },fileLoadDomestic: {
                loadsuccess: 'onFileUploadDomesticSuccess',
                loadfailure: 'onFileUploadFailure'
            }
        }
    },

    decodeCurrencies: function(comp, e){
        Ext.getStore('expensestore').each(function(item,index,length){
            encodeCurrency(item);
        });
    },


    showDetailExpense: function(list, record, target, index, e, options) {
    	if(record.getData()['expenseLocation'] == 'Abroad'){
            decodeCurrency(record);
	        var comp = this.getNav().push({
	            xtype: 'abroadexpensedetail',
	            record: record
	        });
    	} else {
    		var comp = this.getNav().push({
	            xtype: 'domesticexpensedetail',
	            record: record
	        });
    	}
        comp.down('radiofield[name=expenseType]').setGroupValue(record.getData()['expenseType']);
        addImage(record.getData()['evidence'],comp,'loadedImageExpense');
    },
    
    showExpensePDF: function(list, record, target, index, e, options) {
		 Ext.Viewport.setActiveItem(Ext.create('Ext.ux.PDF',{
	            fullscreen: true,
	            layout    : 'fit',
	            src       : Expense.app.getBaseURL() + '/resources/expenseService/getExpenseFormPDF', // URL to the PDF - Same Domain or Server with CORS Support
	            extraParams: 'token='+Expense.app.getToken()+'&expenseFormId='+record.get('id') //TODO expenseFormId
	        }));
    },

    sendAbroadExpense: function(button, e, options){
        //Reset red borders
        Ext.getCmp('abroadfield').getItems().each(function(item,index,length){
            item.removeCls('x-field-custom-error');
        });

        var expense = Ext.create(
            'Expense.model.Expense',
            this.getAbroadExpense().getValues());
        expense.set('evidence',Ext.getCmp('loadedImageAbroad'));
        var errors = expense.validate();
        if(errors.isValid())
        {
            var image = Ext.getCmp('abroadexpense').getComponent('loadedImageAbroad');
            if(image!=undefined)
                expense.set('evidence',image.getSrc());
            Ext.getStore('expensestore').add(expense);
            this.getDetail().setActiveItem(3);
            Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(3),false,false);
            this.getAbroadExpense().reset(); //force reset of the form
        } else{
             var message = '';
             errors.each(function(item, index, length){
                message = message + item.getMessage() + '<br>';
                if(item.getField()!='evidence') //Kan geen kader trekken rond 'evidence' field
                    Ext.getCmp('abroadfield').getComponent(item.getField()+'Abroad').addCls('x-field-custom-error');
             });
             Ext.Msg.show({
                 title: 'Error',
                 message: message,
                 width: 300,
                 buttons: Ext.MessageBox.OK
             });
        }
        Ext.getStore('expensestore').sync();  //save in local storage
    },

    sendDomesticExpense: function(button, e, options){
        //Reset red borders
        Ext.getCmp('domesticfield').getItems().each(function(item,index,length){
            item.removeCls('x-field-custom-error');
        });

        var expense = Ext.create(
            'Expense.model.Expense',
            this.getDomesticExpense().getValues());
        expense.set('evidence',Ext.getCmp('loadedImageDomestic'));
        var errors = expense.validate();
        if(errors.isValid())
        {
            var image = Ext.getCmp('domesticexpense').getComponent('loadedImageDomestic');
            if(image!=undefined)
                expense.set('evidence',image.getSrc());
            Ext.getStore('expensestore').add(expense);
            this.getDetail().setActiveItem(3);
            Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(3),false,false);
            this.getDomesticExpense().reset(); //force reset of the form
        } else{
            var message = '';
            errors.each(function(item, index, length){
                message = message + item.getMessage() + '<br>';
                if(item.getField()!='evidence')
                    Ext.getCmp('domesticfield').getComponent(item.getField()+'Domestic').addCls('x-field-custom-error');
            });
            Ext.Msg.show({
                title: 'Error',
                message: message,
                width: 300,
                buttons: Ext.MessageBox.OK
            });
        }
        Ext.getStore('expensestore').sync(); //save in local storage
    },


    sendExpenses : function(button, e, options){
        Ext.Viewport.setMasked({
            xtype: 'loadmask',
            message: 'Loading...'
        });
        var field = this.getSignfield().getValues();
        var expenseForm = Expense.app.getExpenseForm();
        if(!Ext.isEmpty(Ext.getCmp('signature').getValue())){
            expenseForm.set('date',new Date()); //TODO volgens POC
            expenseForm.set('employeeId',Expense.app.getEmployee().get('id'));
            expenseForm.set('signature' ,Ext.getCmp('signature').getValue());
            expenseForm.set('remarks',field['remarks']);
            expenseForm.set('notification',field['notification']);
            expenseForm.set('statusId',1); //status id by default 1
            var expenses =  new Array();
            Ext.getStore('expensestore').each(function(expense,index,expensesItself){
                var newExpense = expense.getData();
                delete newExpense.id;
                delete newExpense.encoded;
                delete newExpense.xindex;
                //decode string representations to their id
                newExpense.expenseTypeId = typeId2(newExpense);
                delete newExpense.expenseType;
                newExpense.expenseLocationId = locationId2(newExpense);
                delete newExpense.expenseLocation;
                newExpense.evidence = removeBase64prefix(expense.get('evidence'));
                expenses.push(newExpense);
            });
            expenseForm.set('expenses',expenses);
            var sendObject = { "token": Expense.app.getToken(), "expenseForm": expenseForm.getData()};
            var result = Ext.encode(sendObject);
             Ext.Ajax.request({
                 url : Expense.app.getBaseURL() + '/resources/expenseService/saveExpense',
                 method : 'POST',
                 useDefaultXhrHeader: false,
                 jsonData: result,
                 headers: {
                    "Content-Type": "application/json"
                 },
                 success: function() {
                     Ext.Viewport.setMasked(false);
                     Ext.Msg.show({
                         title: 'Save Expense',
                         message: 'Form submitted Succesfully',
                         width: 300,
                         buttons: Ext.MessageBox.OK
                     });
                     //clear expenses and expenseform
                     var expensestore = Ext.getStore('expensestore');
                     expensestore.getProxy().clear(); //BUG indicated @ http://docs.sencha.com/touch/2-1/#!/api/Ext.data.Store-method-removeAll
                     expensestore.sync();
                     Ext.getStore('expenseformstore').removeAll();
                 },
                 failure: function(response, opts) {
                     Ext.Msg.show({
                         title: 'Save Expense',
                         message: 'You are currently offline,  your expense will be saved,  please come back later to resend your expense',
                         width: 300,
                         buttons: Ext.MessageBox.OK
                     });
                 }
             });
            Ext.getCmp('signature').removeCls('x-field-custom-error');
            Ext.Viewport.setActiveItem(Ext.getCmp('home'));
            expenseForm.reset(); //force reset of the form
            Ext.getCmp('signature').reset();
        } else { //validation error
            //can't use build in validation because of singfield plugin can't have a name!
            message = 'A signature must be present';
            Ext.getCmp('signature').addCls('x-field-custom-error');
            Ext.Msg.show({
                title: 'Error',
                message: message,
                width: 300,
                buttons: Ext.MessageBox.OK
            });
        }
    },

    onFileUploadAbroadSuccess: function(dataurl, e) {
        console.log('Abroad file loaded');

        var me = this;
        var image = me.getLoadedImageAbroad();
        image.setSrc(dataurl);
    },

    onFileUploadDomesticSuccess: function(dataurl, e) {
        console.log('Domestic file loaded');

        var me = this;
        var image = me.getLoadedImageDomestic();
        image.setSrc(dataurl);
    },

    onFileUploadFailure: function() {
        console.log('Failure');
        Ext.Msg.alert('File upload', 'Failure!');
    },

    onSearchKeyUp: function(searchField) {
        queryString = searchField.getValue();
        //console.log(this,'Please search by: ' + queryString);

        //create and display the floating list
        var myList = Ext.Viewport.down('projectcodelist');
        if(!myList){
            myList = Ext.widget('projectcodelist');
            myList.showBy(searchField, "tr-br?");
        }
        //just display it
        else {
            myList.setHidden(false);
        }

        //load data into the list store based on the query
        var store = Ext.getStore('projectcodestore');
        var keywordParam = Ext.getCmp('projectCodeAbroad').getValue();
        if(keywordParam==undefined || keywordParam=='')
            keywordParam = Ext.getCmp('projectCodeDomestic').getValue();
        console.log(keywordParam);
        store.load({
            params: {
                keyword: keywordParam
            }
        });


    },

    onClearSearch: function() {
        //console.log('Clear icon is tapped');

        //remove all data from the store
        var store = Ext.getStore('projectcodestore');
        store.removeAll();

        //hide out floating list
        var myList = Ext.Viewport.down('projectcodelist');
        myList.setHidden(true);

    },

    onSelectRow: function(view, index, target, record, event) {
        Ext.getCmp('projectCodeAbroad').setValue(record.get('data'));
        //clear the drop down list
        this.onClearSearch();
    }

});

function addImage(source, destinationCmp, newId){
    var image = Ext.create('Ext.Img', {
        id: newId,
        src: source,
        style: 'background-size: contain; margin-top: 20px; border-radius: 15px;',
        width: 250,
        height: 200
    });
    destinationCmp.add(image);
    image.show();
};

function removeBase64prefix(image){
    return image.substr(image.indexOf(",")+1,image.length-image.indexOf(","));
};