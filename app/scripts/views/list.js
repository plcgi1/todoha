/*Главная вьюха приложения*/

;(function(){
	'use strict';
    window.views = window.views || {};    
    window.views.List = window.views.List || {};

    var View = Backbone.View.extend({
        // главный элемент вьюхи - в котором отрисовывается контент
        el : $('#content'),
        // шаблон списка задач
        template: $('#listTpl').html(),
        // статус по умолчанию
        status: 'waiting',
        events: {
            // удаление таска
            'click .remove' : 'remove',
            // Добавить таск
            'click .add' : 'add',
            // сохранение данных таска
            'click .save' : 'save',
            // изменение статуса таска
            'change .change_status' : 'change_status'
        },
        initialize: function () {
            _.bindAll(this,'remove','add','save','change_status');
            // добавляем шаблон для отрисовки логики добавления таска
            this.item_template = $('#itemTpl').html();            
			
			return;
        },
        render : function(status){
            this.status = status;
            // достаем данные из хранилища
            var data = this.model.fetch();
            
            if (status === 'all') {
                // тут выведутся все таски
                data = this.model.toJSON();
            }
            else {
                data = _.where(this.model.toJSON(),{ status : status });
            }
            // кешируем шаблон
            Mustache.parse(this.template);
            // рендерим шаблон
			Mustache.parse(this.template);
            var markup = Mustache.render(this.template, { tasks:  data });
            var el = $(this.el);
            el.html(markup)  ;
            // устанавливаем значение статусов для каждого таска
            _.each(data,function(el,i,list){
                $('select[task_id="'+el.id+'"]').val(el.status);
            });
        },
        // удаление таска из хранилища и из памяти
        remove : function(evt){
            var el = $(evt.target);
            var id = el.attr('task_id');
            var removed = this.model.get(id);
            this.model.remove_item(removed);
            el.parent().parent().remove();
        },
        // показвыаем gui для добавления задачи
        add: function(evt){
            this.status = 'warning';
            this.router.navigate('filter/'+this.status);
            this.router.views.nav.set_active(this.status);
            this.render(this.status);
            $(this.el).find('.list:first').before(this.item_template);
            
        },
        // сохранение данных задачи
        save : function(evt){
            var val = $(evt.target).prev().children()[0].value;
            
            this.model.add_item({ task : val, status : this.status});
            this.render(this.status);
        },
        // изменение статуса задачи
        change_status : function(evt){
            var el = $(evt.target);
            var status = el.val();
            this.model.change_item({ id : el.attr('task_id'), status : status });
            
            var par = el.parent().parent();
            par.removeClass('alert-danger alert-success alert-warning');
            par.addClass('alert-'+status);
            
            this.router.navigate('filter/'+status);
            this.router.views.nav.set_active(status);
            this.render(status);
        }
    });
    var v = new View();
    // инициаоизация объекта задачи
    window.views.List.initialize = function(opts){
        v.model = opts.model;
        return v;
    };
})();
