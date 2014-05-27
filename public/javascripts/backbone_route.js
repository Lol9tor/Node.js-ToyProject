App.Routes.route = Backbone.Router.extend({
    routes: {
        '': 'index',
        'add': 'addAction',
        'update': 'editAction'
    },
    index: function () {
        $('#userForm').hide();
        $('#usersTable').show();
    },
    addAction: function () {
        $('#usersTable').hide();
        this.clearForm();
        $('#userForm').show();
    },
    editAction: function () {
        $('#userForm').show();
        $('#usersTable').hide();
    },
    clearForm: function () {
        $('#login').val('');
        $('#password').val('');
        $('#confirm').val('');
        $('#email').val('');
        $('#firstName').val('');
        $('#lastName').val('');
        $('#birthday').val('');
        $('#role').val('admin');
        $('#login').prop('disabled', false);
    }
});