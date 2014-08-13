/* представление фильтров статусов тасков */
;(function(){
	'use strict';
    window.views = window.views || {};    
    window.views.Nav = window.views.Nav || {};

    var View = Backbone.View.extend({
        el : $('#nav'),
		// установка класса active для пунктов меню
        set_active: function(route){
            var last_active = $(this.el).find('li.active:first');
            last_active.removeClass('active');
            
            var li = $(this.el).find('a[href="#filter/'+route+'"]').parent();
            li.addClass('active');
        }
    });
    var v = new View();
    window.views.Nav.initialize = function(opts){
        return v;
    };
})();
