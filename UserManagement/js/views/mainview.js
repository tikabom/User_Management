define([ 'jquery', 'jquerymobile', 'underscore', 'backbone',
		'text!pages/main.html', 'views/toolbarview', 'text!pages/toolbar.html', 'text!pages/toolbar-m.html'], function($, _, Backbone,
		Main, ToolbarView, Toolbar, ToolbarMobile) {
	var MainView = Backbone.View.extend({
		el : $('body'),

		initialize : function() {
			this.render();
		},
		
		render: function() {
			
			this.$el.html(Main);
			
			var userAgent = navigator.userAgent.toLowerCase();

			if (userAgent.indexOf('iphone') >= 0
					|| userAgent.indexOf('ipad') >= 0
					|| userAgent.indexOf('ipod') >= 0
					|| userAgent.indexOf('android') >= 0
					|| userAgent.indexOf('bb') >= 0
					|| userAgent.indexOf('blackberry') >= 0
					|| userAgent.indexOf('tablet') >= 0
					|| userAgent.indexOf('symbian') >= 0) {
				toolbarView = new ToolbarView({template: _.template(ToolbarMobile)});
			} else {
				toolbarView = new ToolbarView({template: _.template(Toolbar)});
			}
		}
	});

	return MainView;
});