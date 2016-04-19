define([ 'jquery', 'underscore', 'backbone','views/toolbarview'],
		function($, _, Backbone,ToolbarView) {

			var AppRouter = Backbone.Router.extend({
				routes : {
					'*actions' : 'defaultAction'
				}
			});

			var initialize = function() {
				var appRouter = new AppRouter();
				
				appRouter.on('route:defaultAction',function() {
					var toolbar = new ToolbarView();
				});
				
				Backbone.history.start();
			};
			
			return {
				initialize: initialize
			};
});