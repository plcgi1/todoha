/*global Todoha, $*/

;(function(){
    // роутер для показа задач по состояниям
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
        // главный фильтр - выводит таски только по статусу
        filter: function(route){
            if(location.hash){
                route = location.hash.split('/')[1];
            }
            else if(!route || typeof route == 'undefined' ){
                route = this.defaultRoute;    
            }
            // отрработка списка тасков по статусу
            this.views.status.render(route);
            // установка пункта меню
            this.views.nav.set_active(route);
        }
    });
    // главная модель для хранения тасков
    var tasks = window.models.Tasks.initialize();
    // отображение тасков
    var status_view = window.views.List.initialize({ model : tasks });
    // отображение фильтра тасков
    var nav_view = window.views.Nav.initialize();
    
    var router = new Router({
        views: { status: status_view, nav : nav_view }
    });
    status_view.router = router;
})();

