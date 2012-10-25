Ext.define('Sencha.view.Products',{
	extend: 'Ext.Carousel',
	xtype: 'productspage',
	config: {
		iconCls: 'star',
		title: 'Product',
		items : [ {
			xtype: 'image',
			src:'touch/resources/images/icon1.png'
		},{
			xtype: 'image',
			src:'touch/resources/images/icon2.png'
		} ]
	}
})