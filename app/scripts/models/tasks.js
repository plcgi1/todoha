;(function(){
    'use strict';
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

    var Model = Backbone.Model.extend({
    });
    
    var Collection = Backbone.Collection.extend({
        model : Model,
        localStorage: new Backbone.LocalStorage('todoha'),
        add_item: function(hash){
            var last = this.length;
            hash.id = last + 1;
            this.create(hash);
        },
        remove_item: function(removed){
            removed = this.remove(removed);
            this.sync('delete', this, { model : removed });
        },
        change_item: function(opts){
            var model = this.get(opts.id);
            model.attributes.status = opts.status;
            this.set(model);
            this.sync('update', this, { model : model } );
        }
    });
    
    window.models.Tasks.initialize = function(){
        return new Collection();
    };
})();