Ext.define('Sencha.view.Viewport', {
	extend : 'Ext.TabPanel',
	config : {
		fullscreen : true,
		tabBarPosition : 'bottom',
		items : [ {
			xtype : 'homepanel'
		}, {
			xtype : 'productspage'
		}, {
			xtype : 'blogpage',
			store : {
				field : [ 'title', 'url' ],
				data : [ {
					title : 'test',
					url : 'http://www.gamechallenge.com'
				} ]
			}
		},{
			xtype: 'contactpage'
		} ]
	}
});