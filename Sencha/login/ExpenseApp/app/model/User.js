Ext.define('ExpenseApp.model.User', {
    extend:'Ext.data.Model',

    config:{
        fields:[
            {
                name:'username'
            },
            {
                name:'password'
            }
        ],

        validations:[
            {
                field:'username',
                type:'presence'
            },
            {
                field:'password',
                type:'presence'

            }
        ]
    }

});