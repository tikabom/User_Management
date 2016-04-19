define(['underscore','backbone'],function(_,Backbone) {
	var User = Backbone.Model.extend({
		idAttribute: 'username',
		urlRoot: 'scripts/php/users',
        defaults: {
            password: '',
            name: '',
            email: '',
            authorized: '0',
            dma: '0',
            fa: '0',
            va: '0',
            im: '0'
        }
    });
	
	return User;
});