;(function(){
    'use strict';

    // метод вызывается всегда - когда модель необходимо сохранить на сервере
    // у нас он тут переопределен - для использования localstorage
    Backbone.sync = function(method, model, options) {
        var resp;
        var store = model.localStorage || model.collection.localStorage;
        options = options || {};
        options.success = options.success || function(){};
        options.error = options.error || function(){};
        var my_model = options.model || model;
        switch (method) {
          case "read":    resp = my_model.id ? store.find(my_model) : store.findAll(); break;
          case "create":  resp = store.create(my_model);                            break;
          case "update":  resp = store.update(my_model);                            break;
          case "delete":  resp = store.destroy(my_model);                           break;
        }
      
        if (resp) {
            options.success(resp);
        } else {
            options.error("Record not found");
        }
    };
        
    window.models = window.models || {};
    window.models.Tasks = window.models.Tasks || {};
    
    // Generate four random hex digits.
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    
    // Generate a pseudo-GUID by concatenating random hexadecimal.
    function guid() {
       return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    };
    var Model = Backbone.Model.extend({
    });
    
    var Collection = Backbone.Collection.extend({
        model : Model,
        // таски сохраняются в localstorage
        localStorage: new Backbone.LocalStorage('todoha'),
        add_item: function(hash){
            var last = this.length;
            hash.id = guid();
            this.add(hash);
            // сохраняем данные в localstorage
            this.sync('create', this, { model : hash });
        },
        remove_item: function(removed){
            removed = this.remove(removed);
            // удаляем данные из localstorage
            this.sync('delete', this, { model : removed });
        },
        change_item: function(opts){
            var model = this.get(opts.id);
            // меняем статус у таска
            model.attributes.status = opts.status;
            this.set(model);
            // сохраняем данные в localstorage
            this.sync('update', this, { model : model } );
        }
    });
    
    window.models.Tasks.initialize = function(){
        return new Collection();
    };
})();
