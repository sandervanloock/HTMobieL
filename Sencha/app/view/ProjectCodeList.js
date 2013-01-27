Ext.define('Expense.view.ProjectCodeList', {
    extend: 'Ext.dataview.List',
    alias : 'widget.projectcodelist',

    config: {
        store : 'projectcodestore',
        //left: 0,
        top: 0,
        //hideOnMaskTap: true,
        width: 300,
        height: "50%",
        itemTpl:  '<tpl for="data"><p>{name}</p></tpl>',
        emptyText: 'No Matching Project Codes'

    }
});