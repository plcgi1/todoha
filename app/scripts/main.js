/*global Todoha, $*/

;(function(){
    
    var Router = Backbone.Router.extend({
        routes : {
            "filter/:route" : "filter"
        },
        initialize: function(opts){
            _.bindAll(this,'filter');
            this.views = opts.views;
            this.defaultRoute = 'waiting';
            Backbone.history.start();
        },
        filter: function(route){
            if(location.hash){
                route = location.hash.split('/')[1];
            }
            else if(!route || typeof route == 'undefined' ){
                route = this.defaultRoute;    
            }
            this.views.status.render(route);
            this.views.nav.set_active(route);
        }
    });
    var tasks = window.models.Tasks.initialize();
    var status_view = window.views.List.initialize({ model : tasks });
    var nav_view = window.views.Nav.initialize();
    
    var router = new Router({
        views: { status: status_view, nav : nav_view }
    });
    status_view.router = router;
})();
$(document).ready(function(){
    
});
