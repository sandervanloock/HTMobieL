Ext.require([
	'ux.signaturefield'
]);
Ext.application({				
	name: 'myApp',
    views: [
        'Signature'		
    ],
    controllers: [
        'Signature'
    ],
    viewport: {
        autoMaximize: true
    }
});