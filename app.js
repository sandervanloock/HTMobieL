Ext.Loader.setConfig({
	enabled : true
});

Ext.application({
	name : 'Sencha',
	controllers: ['Main'],
	views: ['Home','Products', 'Viewport','Blog', 'Contact'],
	launch: function() {
		Ext.create('Sencha.view.Viewport');
	}
});