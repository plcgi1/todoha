///*global Todoha, Backbone, JST*/

;(function(){
	'use strict';
    window.views = window.views || {};    
    window.views.List = window.views.List || {};

    var View = Backbone.View.extend({
        el : $('#content'),
        template: $('#listTpl').html(),
        status: 'waiting',
        events: {
            'click .remove' : 'remove',
            'dblclick .change' : 'change',
            'click .add' : 'add',
            'click .save' : 'save',
            'change .change_status' : 'change_status'
        },
        initialize: function () {
            _.bindAll(this,'remove','add','save','change_status');
            this.item_template = $('#itemTpl').html();            
        },
        render : function(status){
            this.status = status;
            var data = this.model.fetch();
            if (status === 'all') {
                data = this.model.toJSON();
            }
            else {
                data = _.where(this.model.toJSON(),{ status : status });
            }
            var markup = Mustache.render(this.template, { tasks:  data });
            var el = $(this.el);
            el.html(markup)   
        },
        remove : function(evt){
            var el = $(evt.target);
            var id = el.attr('task_id');
            var removed = this.model.get(id);
            this.model.remove_item(removed);
            el.parent().parent().remove();
        },
        add: function(evt){
            this.status = 'warning';
            this.router.navigate('filter/'+this.status);
            this.router.views.nav.set_active(this.status);
            $(this.el).find('.list:first').before(this.item_template);
        },
        save : function(evt){
            var val = $(evt.target).prev().children()[0].value;
            
            this.model.add_item({ task : val, status : this.status});
            this.render(this.status);
        },
        change_status : function(evt){
            var el = $(evt.target);
            var status = el.val();
            this.model.change_item({ id : el.attr('task_id'), status : status });
            
            var par = el.parent().parent();
            par.removeClass('alert-danger alert-success alert-warning');
            par.addClass('alert-'+status);
            //this.render(model.attributes.status);
            this.router.navigate('filter/'+status);
            this.router.views.nav.set_active(status);
        }
    });
    var v = new View();
    window.views.List.initialize = function(opts){
        v.model = opts.model;
        return v;
    };
})();
