// view form application
App.Views.App = Backbone.View.extend({
    el: '#content',
    events: {
        'click a#addLink': 'showForm'
    },
    initialize: function () {
        // create all users view and append it to DOM
        App.Views.current = new App.Views.Users({collection: App.users}).render();
    },
    showForm: function (e) {
        e.preventDefault();
        drawForm();
        $('#usersTable').hide();
        App.Views.current = new App.Views.AddUser({collection: App.users});
    }
});

//view for single user
App.Views.User = Backbone.View.extend({
    tagName: 'tr',
    initialize: function () {
        //listeners
        this.model.on('destroy', this.unrender, this);
        this.model.on('change', this.render, this);
    },
    events: {
        'click button#delete': 'remove',
        'click button#edit': 'edit'
    },
    render: function () {
        this.calculateAge();
        //appending to DOM
        this.$el.html(_.template($('#userRowTemplate').html(), this.model.toJSON()));
        return this;
    },
    remove: function (e) {
        e.preventDefault();
        var obj = this.model;
        //init confirm dialog
        bootbox.confirm("Are you sure?", function (result) {
            if (result) {
                obj.destroy();
            }
        });
    },
    unrender: function () {
        //stop listening and remove user view from DOM
        this.$el.remove();
    },
    edit: function (e) {
        e.preventDefault();
        $('#usersTable').hide();
        drawForm();
        App.Views.current = new App.Views.EditUser({model: this.model});
    },
    calculateAge: function () {
        //calculate current age for this user
        var age = Math.floor((new Date().getTime() - this.model.get('birthday')) / (365.25 * 24 * 60 * 60 * 1000));
        this.model.attributes['age'] = (age == -1 ? 0 : age);
    }
});

App.Views.Users = Backbone.View.extend({
    el: '#usersTable',
    initialize: function () {
        this.collection.on('add', this.addUserRow, this);
    },
    render: function () {
        this.collection.each(this.addUserRow, this);
        return this;
    },
    addUserRow: function (user) {
        this.$el.append(new App.Views.User({model: user}).render().el);
        this.$el.show();
    }
});

App.Views.AddUser = Backbone.View.extend({
    el: '#userForm',
    events: {
        'submit': 'addUser',
        'click #cancelBtn': 'cancelAction'
    },
    addUser: function (e) {
        e.preventDefault();
        if ($('#userForm').valid()) {
            var user = this.constructModel();
            this.collection.create(user, {wait: true, success: this.success(this), error: this.error});
        }
    },
    success: function (obj) {
        obj.remove();
    },
    error: function () {
        $('#modal').modal();
    },
    cancelAction: function () {
        this.remove();
        $('#usersTable').show();
    },
    constructModel: function () {
        return new App.Models.User({
            login: this.$('#login').val(),
            password: this.$('#password').val(),
            confirm: this.$('#confirm').val(),
            email: this.$('#email').val(),
            firstName: this.$('#firstName').val(),
            lastName: this.$('#lastName').val(),
            birthday: this.$('#birthday').val(),
            role: this.$('#role').val()
        });
    }
});

App.Views.EditUser = Backbone.View.extend({
    el: '#userForm',
    initialize: function () {
        this.render();
    },
    events: {
        'submit': 'updateUser',
        'click #cancelBtn': 'cancelAction'
    },
    render: function () {
        $('#login').val(this.model.get('login'));
        $('#password').val(this.model.get('password'));
        $('#confirm').val(this.model.get('password'));
        $('#email').val(this.model.get('email'));
        $('#firstName').val(this.model.get('firstName'));
        $('#lastName').val(this.model.get('lastName'));
        $('#birthday').val(this.convertDate(this.model.get('birthday')));
        $('#role').val(this.model.get('role').name);
        $('#login').prop('disabled', true);
        this.$el.show();
    },
    updateUser: function (e) {
        e.preventDefault();
        if (this.$el.valid()) {
            this.model.unset('age', {silent: true});
            this.model.save({
                id: this.model.get('id'),
                login: $('#login').val(),
                password: $('#password').val(),
                confirm: $('#confirm').val(),
                email: $('#email').val(),
                firstName: $('#firstName').val(),
                lastName: $('#lastName').val(),
                birthday: $('#birthday').val(),
                role: $('#role').val()
            }, {wait: true, success: this.success(this), error: this.error});
        }
    },
    convertDate: function (miliseconds) {
        var date = new Date(miliseconds);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return month + '/' + day + '/' + year;
    },
    success: function (obj) {
        obj.remove();
        $('#usersTable').show();
    },
    error: function () {
        $('#modal').modal();
    },
    cancelAction: function () {
        this.remove();
        $('#usersTable').show();
    }
});

function drawForm() {
    $('#content').append(_.template($('#userFormTemplate').html()));
    $('#birthday').datepicker();
    $('#userForm').show();
    $('#userForm').validate({
        rules: {
            login: {
                required: true,
                remote: {
                    url: 'check',
                    type: 'get',
                    data: {
                        login: function () {
                            return $('#login').val();
                        }
                    }
                }
            },
            password: {
                required: true
            },
            confirm: {
                required: true,
                equalTo: '#password'
            },
            email: {
                required: true,
                email: true
            },
            firstName: {
                required: true
            },
            lastName: {
                required: true
            },
            birthday: {
                required: true
            }
        },
        highlight: function (element) {
            $(element).closest('.control-group').removeClass('success').addClass('error');
        },
        success: function (element) {
            element.closest('.control-group').removeClass('error').addClass('success');
        }
    });
}