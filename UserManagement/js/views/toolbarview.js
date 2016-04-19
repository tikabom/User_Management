define([ 'jqueryui', 'underscore', 'backbone', 'text!pages/toolbar.html',
		'models/user', 'collections/userlist', 'views/current-userview', 'views/userview' ],
		function($, _, Backbone, Toolbar, User, UserList, CurrentUserView, UserView) {
			var userView = null;
			var ToolbarView = Backbone.View.extend({
				el : $('#toolbar'),
				events : {
					'keydown #searchText' : 'checkEnter',
					'click button#searchButton' : 'searchUser',
					'click button#addButton' : 'newUserForm',
					'click button#refreshButton' : 'refreshUserList'
				},
				
				initialize: function() {
					this.collection = new UserList();
					var self = this;
					this.collection.fetch({
						success: function() {
							self.render();
						}
					});
					this.collection.on('remove',this.onRemove, this);
				},

				render : function() {
					userView = new UserView({ collection: this.collection });
					this.$el.html(Toolbar);
					this.getUserList();
				},
				
				getUserList: function() {
					var list = [];							
					_(this.collection.models).each(function(user) {
						list.push(user.get('name'));
					});
					$('#searchText', this.el).autocomplete({
						source : list
					});
				},
				
				checkEnter: function(e) {
					if(e.keyCode == '13')
						this.searchUser();
				},
				
				searchUser: function() {
					var q = $('#searchText', this.el).val();
					userView.searchUser(q);
				},

				newUserForm : function() {
					userView.newUserForm();
				},

				refreshUserList : function() {
					if(userView)
						userView.removeView();
					this.collection = new UserList();
					var self = this;
					this.collection.fetch({
						success: function() {
							self.render();
						}
					});
				},
				
				onRemove: function() {
					this.getUserList();
				}
			});

			return ToolbarView;
		});