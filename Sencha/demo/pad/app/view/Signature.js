Ext.define('myApp.view.Signature', {
    extend: 'Ext.Container',
    requires: [
		'Ext.form.Panel',
		'Ext.form.FieldSet'
    ],
config: {
        layout: 'card',
        items: [{
			xtype: 'formpanel',			
			padding: '10 10 10 10',
			items: [{
				xtype: 'fieldset',
				items: [{
					xtype: 'signaturefield',
					id: 'signatureField',
					sigWidth: 350,
					sigHeight: 150,
					label:'Enter Signature',
					labelWidth: '20%'
				}]
			},{
				xtype: 'button',
				text: 'Get Data',
				margin:'0 0 10 0',
				action: 'getSignature'
			},{
				xtype: 'button',
				text: 'Set Data',
				action: 'setSignature'
			}]
		}]
    },
    initialize: function() {
        this.callParent();
    }
});