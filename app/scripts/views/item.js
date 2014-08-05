;(function(){
	'use strict';
    window.views = window.views || {};    
    window.views.Item = window.views.Item || {};

    var View = Backbone.View.extend({
        el : $('#item'),
        template: $('#itemTpl').html(),
        status: 'waiting',
        events: {
            'click .add' : 'add'
        },
        render : function(status){
            this.status = status;
            
            var markup = Mustache.render(this.template, { status:  this.status });
            var el = $(this.el);
            el.html(markup)   
        },
        add : function(evt){
            var el = $(evt.target);
            var id = el.attr('task_id');
            var removed = this.model.where({ id: id });
            this.model.remove(removed);
            el.parent().parent().remove();
        }
    });
    var v = new View();
    window.views.Item.initialize = function(opts){
        v.model = opts.model;
        return v;
    };
})();
