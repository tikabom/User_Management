define(['underscore','backbone','models/atg-app'],function(_,Backbone,ATGApp) {
	var AppList = Backbone.Collection.extend({
		url: 'scripts/php/apps',
        model: ATGApp
    });
	
	return AppList;
});