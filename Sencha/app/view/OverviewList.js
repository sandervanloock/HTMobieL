
Ext.define('Expense.view.OverviewList', {
    extend: 'Ext.dataview.List',
    alias: 'widget.overviewlist',

    config: {
        id: 'overviewlist',
        ui: 'round',
        store: 'expensestore',
        onItemDisclosure: true,
        itemTpl: [
            '<div>{date:date("d/m/Y")} &mdash; <small> {expenseType} : {[this.convertCurrencyToEuro(values.currency,values.amount)]}  EUR</small></div>',
            {
                convertCurrencyToEuro: function(curr,value){
                    if(curr=="EUR")
                        return value;
                    else{
                        var currencies = Ext.getStore('currencystore').queryBy(
                            function(testRecord, id) {
                                return testRecord.get('currency') == curr;
                            }).first();
                        var newAmount = value / currencies.get('rate');
                        newAmount = Math.round(newAmount*100)/100;
                        return newAmount;
                    }
                }
            }
        ]
    }


});