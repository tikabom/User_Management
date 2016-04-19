define(
		[ 'jquery', 'underscore', 'backbone', 'views/current-userview', 'collections/userlist',
				'models/user', 'text!pages/manage-users.html' ],
		function($, _, Backbone, CurrentUserView, UserList, User, UserManager) {
			var currentUserView = null;
			var UserView = Backbone.View
					.extend({
						el : $('#all-users'),
						
						events : {
							'mouseenter ul.userList li' : 'showButtons',
							'mouseleave ul.userList li' : 'hideButtons',
							'click ul.userList li button.editButton' : 'editUser',
							'click ul.userList li button.delButton' : 'delUser'
						},
						
						initialize : function() {
							this.render();
						},

						render : function() {
							this.$el.html(UserManager);
							_(this.collection.models)
									.each(
											function(user) {
												var approved = user
														.get('authorized');
												if (approved == '1')
													$('ul.userList', this.el)
															.append(
																	'<li>'
																			+ user.get('name') + ' (' + user.get('email') + ')'
																			+ '<button class="delButton">'
																			+ '<img class="userImg" src="images/delete.png" width="30" height="30">'
																			+ '</button>'
																			+ '<button class="editButton">'
																			+ '<img class="userImg" src="images/edit.png" width="30" height="30">'
																			+ '</button></li>');
												else
													$('ul.userList', this.el)
															.append(
																	'<li class="unapproved">'
																			+ user.get('name') + ' (' + user.get('email') + ')'
																			+ '<button class="delButton">'
																			+ '<img class="userImg" src="images/delete.png" width="30" height="30">'
																			+ '</button>'
																			+ '<button class="editButton">'
																			+ '<img class="userImg" src="images/edit.png" width="30" height="30">'
																			+ '</button></li>');
											});
							$('ul.userList li',this.el).children('button').hide();
						},
						
						showButtons: function(e) {
							$(e.target).children('button').show();
						},
						
						hideButtons: function(e) {
							$(e.target).children('button').hide();
						},
						
						editUser : function(e) {
							var name = $(e.target).parents('li').text();
							name = name.substring(0,name.indexOf('(')-1);
							_(this.collection.models).each(function(user) {
								if(name == user.get('name')) {
									if(currentUserView)
										currentUserView.removeView();
									currentUserView = new CurrentUserView(user);
								}
							});
						},
						
						delUser : function(e) {
							var id = '';
							var name = $(e.target).parents('li').text();
							name = name.substring(0,name.indexOf('(')-1);
							var del = confirm('Are you sure you want to delete ' + name + '?');
							if(del) {
								_(this.collection.models).each(function(user) {
									if(name == user.get('name')) {
										id = user.get('username');
									}
								});
								
								var user = this.collection.get(id);
								this.collection.remove(user);
								user.destroy({
									success: function() {
										alert('User has been successfully deleted');
									}
								});
								alert(name + ' has been successfully deleted from the user list');
								this.render();
								window.location.reload(true);
							}
						},
						
						searchUser: function(q) {
							_(this.collection.models).each(function(user) {
								var name = user.get('name');
								if(name.toUpperCase() == q.toUpperCase()) {
									if(currentUserView)
										currentUserView.removeView();
									currentUserView = new CurrentUserView(user);
								}
							});
						},
						
						newUserForm: function() {
							if(currentUserView)
								currentUserView.removeView();
							currentUserView = new CurrentUserView();
						},
						
						removeView: function() {
							this.$el.removeData().unbind();
							this.$el.html('');
						}
					});

			return UserView;
		});