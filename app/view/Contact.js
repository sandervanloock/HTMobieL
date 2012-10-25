Ext.define('Sencha.view.Contact', {
	extend : 'Ext.form.Panel',
	xtype : 'contactpage',
	id: 'contactForm',
	config : {
		title : 'Contact Us',
		iconCls : 'user',
		layout : {
			type : 'vbox'
		},
		items : [ {
			xtype : 'fieldset',
			title : 'contact Us',
			instructions : 'Email is optional',
			items : [ {
				xtype : 'textfield',
				label : 'Name',
				name : 'name'
			}, {
				xtype : 'textareafield',
				label : 'Message',
				name : 'message'
			} ]
		}, {
			xtype : 'button',
			ui : 'confirm',
			text : 'Send',
			action : 'submitContact'
		} ]
	}
});