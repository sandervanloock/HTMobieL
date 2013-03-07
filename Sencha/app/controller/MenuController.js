Ext.define('Expense.controller.MenuController', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            detail: 'page',
            myinfo : 'infopanel'
        },

        control: {
            "#menulist": {
                itemtap: 'openMenuItem'
            }
        }
    },

    openMenuItem: function(dataview, index, target, record, e, options) {

        //Reset red borders
        Ext.getCmp('infofield').getItems().each(function(item,index,length){
            item.removeCls('x-field-custom-error');
        });

        //Validate employee records
        var employee = Ext.create(
            'Expense.model.Employee',
            this.getMyinfo().getValues());

        var errors = employee.validate();
        if(errors.isValid())
        {
            this.getDetail().setActiveItem(index);
            Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(index-1),false,false);

            //set expense form date
            var myDate=new Date();
            myDate.setFullYear(Ext.getCmp('year').getValue(),Ext.getCmp('month').getValue(),1);
            Expense.app.getExpenseForm().set('date',myDate);
            if(index==1){
                //encode currencies at runtime
                Ext.getStore('expensestore').each(function(item,index,length){
                    encodeCurrency(item);
                });
            }
        }
        else
        {
            var message = '';
            errors.each(function(item, index, length){
                message = message + item.getMessage() + '<br>';
                if(item.getField()!='evidence')
                    Ext.getCmp('infofield').getComponent(item.getField()).addCls('x-field-custom-error');
            });

            Ext.Msg.show({
                title: 'Error',
                message: message,
                width: 300,
                buttons: Ext.MessageBox.OK,
                fn: function(){
                        Ext.getCmp('menulist').select(Ext.getStore('menustore').getAt(0),true,true); //do not change menu selection
                }
            });
        }

        if(Ext.os.is.Phone){
            Ext.getCmp('page').setHidden(false);
            Ext.getCmp('menupanel').setHidden(true);
        }
    }

});