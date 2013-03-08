Ext.define('ExpenseApp.model.User', {
    extend:'Ext.data.Model',

    config:{
        fields:[
            {
                name:'name'
            },
            {
                name:'password'
            }
        ],

        validations:[
            {
                field:'name',
                type:'presence'
            },
            {
                field:'password',
                type:'presence'

            }
        ]
    }

});