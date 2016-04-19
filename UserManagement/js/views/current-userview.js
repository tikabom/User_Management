define(
		[ 'jquery', 'underscore', 'backbone', 'text!pages/current-user.html',
				'models/atg-app', 'collections/applist',
				'text!pages/add-app.html', 'models/user' ],
		function($, _, Backbone, CurrentUser, ATGApp, AppList, AddApp, User) {
			var CurrentUserView = Backbone.View
					.extend({
						el : $('div.currentUser'),
						events : {
							'click form #authorization' : 'toggleAccess',
							'click form .apps label.toggle input[type="checkbox"]' : 'toggleButton',
							'submit form' : 'addUser',
							'click form #cancel' : 'removeView'
						},

						initialize : function(user) {
							if (user) {
								this.model = user;
							}
							this.collection = new AppList();
							var self = this;
							this.collection.fetch({
								success : function() {
									self.render();
								}
							});
						},

						render : function() {
							if (this.model) {
								var self = this;
								_(this.collection.models).each(
										function(atgApp) {
											var _id = atgApp.get('_id');
											atgApp.set({
												checked : self.model.get(_id)
											});
										});
							}
							this.$el.html(CurrentUser);
							if (this.model) {
								$('form #username', this.el).val(
										this.model.get('username'));
								$('form #username', this.el).prop('disabled',
										'disabled');
								$('form #password', this.el).val(
										this.model.get('password'));
								$('form #password', this.el).prop('disabled',
										'disabled');
								$('form #fullname', this.el).val(
										this.model.get('name'));
								$('form #fullname', this.el).prop('disabled',
										'disabled');
								$('form #emailId', this.el).val(
										this.model.get('email'));
								$('form #emailId', this.el).prop('disabled',
										'disabled');
								if (this.model.get('authorized') == '1')
									$('form #authorization', this.el).prop(
											'checked', 'checked');
							}

							_(this.collection.models)
									.each(
											function(atgApp) {
												var candy = atgApp
														.get('checked');
												if (candy == '1') {
													$('div.apps', this.el)
															.append(
																	'<label id="'
																			+ atgApp
																					.get('_id')
																			+ '" class="toggle candy-off candy-on"></label>');
												} else {
													$('div.apps', this.el)
															.append(
																	'<label id="'
																			+ atgApp
																					.get('_id')
																			+ '" class="toggle candy-off"></label>');
												}

												var data = {
													idAttr : atgApp.get('_id'),
													name : atgApp.get('name')
												};
												var compiled = _.template(
														AddApp, data);
												$(
														'div.apps label#'
																+ data.idAttr,
														this.el).html(compiled);

												if (candy == '1')
													$(
															'div.apps label#'
																	+ atgApp
																			.get('_id')
																	+ ' input[type="checkbox"]',
															this.el).prop(
															'checked',
															'checked');
											});
						},

						toggleAccess : function(e) {
							if (!$(e.target).prop('checked')) {
								$('div.apps', this.el).children('label.toggle')
										.removeClass('candy-on');
								$(
										'div.apps label.toggle input[type="checkbox"]',
										this.el).removeProp('checked');
								_(this.collection.models).each(
										function(atgApp) {
											atgApp.set({
												checked : '0'
											});
										});
							}
						},

						toggleButton : function(e) {
							if ($('form #authorization', this.el).prop(
									'checked')) {
								$(e.target).parent().toggleClass('candy-on');
								var idAttr = $(e.target).parent().prop('id');
								var atgApp = this.collection.get(idAttr);
								atgApp.set({
									checked : $(e.target).prop('checked') ? '1'
											: '0'
								});
								this.collection.remove(idAttr);
								this.collection.add(atgApp);
							} else {
								e.preventDefault();
							}
						},

						addUser : function(e) {
							var edit = false;
							if (!this.model) {
								this.model = new User();
								this.model.set({
									username : $('form #username', this.el)
											.val(),
									password : $('form #password', this.el)
											.val(),
									name : $('form #fullname', this.el).val(),
									email : $('form #emailId', this.el).val(),
								});
							} else {
								edit = true;
							}

							this.model
									.set({
										authorized : $('form #authorization',
												this.el).prop('checked'),
										dma : this.collection.get('dma').get(
												'checked'),
										fa : this.collection.get('fa').get(
												'checked'),
										va : this.collection.get('va').get(
												'checked'),
										im : this.collection.get('im').get(
												'checked')
									});
							this.model.save({
								success : function() {
									alert('User successfully added!');
								}
							});
							
							if(edit)
								alert('Changes to ' + this.model.get('name') + ' have been made!');
							else
								alert(this.model.get('name') + ' has been successfully added!');
							window.location.reload(true);
						},

						removeView : function() {
							this.$el.removeData().unbind();
							this.$el.html('');
						}
					});

			return CurrentUserView;
		});