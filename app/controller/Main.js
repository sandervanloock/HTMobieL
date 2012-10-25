Ext.define('Sencha.controller.Main', {
	extend : 'Ext.app.Controller',

	config : {
		refs : {
			test : '#contactForm'
		}
	},
	
	init : function() {
		this.control({
			'button[action=submitContact]' : {
				tap : 'submitContactform'
			}
		});
	},

	submitContactform : function() {
		var form = this.getTest();
		form.submit(){
			
		}
	}
});