define(['underscore','backbone','models/user'],function(_,Backbone,User) {
	var UserList = Backbone.Collection.extend({
		url: 'scripts/php/users',
        model: User
    });
	
	return UserList;
});