define(['underscore','backbone'],function(_,Backbone) {
	var ATGApp = Backbone.Model.extend({
		idAttribute: "_id",
		urlRoot: 'scripts/php/apps',
        defaults: {
        	_id: '',
            name: '',
            checked: '0'
        }
    });
	
	return ATGApp;
});