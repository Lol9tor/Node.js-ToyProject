App.Models.User = Backbone.Model.extend({
    idAttribute: 'login',
    sync: function (method, model, options) {
        if (method === 'update') {
            options.url = 'service';
            if (model.get('id') === undefined) {
                method = 'create';
            }
        }
        return Backbone.sync(method, model, options);
    }
});