$(document).ready(function () {
    $('#content').on('click', 'a', function (e) {
        e.preventDefault();
        if ($(this).attr('id') === 'deleteUser') {
            if (window.confirm('Delete this user?')) {
                var userLog = $(this).parent().prevAll()[6].firstChild.textContent;// login in the string with "delete"
                var strdel = $(this).parent().parent();// string, which we delete
                deleteUser(userLog, strdel);
            }
        }
        if ($(this).attr('id') === 'newUserLink') {
            openForm();
        }
        if ($(this).attr('id') === 'updateUser') {
            var userLogin = $(this).parent().prevAll()[6].firstChild.textContent;
            var strupd = $(this).parent().parent();
            updateUser(userLogin, strupd);
        }
    });
    var passwordConf;
    var table;
    $.ajax({
        type: "GET",
        url: "/service"
    })
        .done(function (msg) {
            table = $('<table></table>').addClass('foo').attr('id', 'foo');
            drawTable(msg);
            $("table.foo").prepend("<tr class='header'><td>#</td><td>Login</td><td>Password</td><td>Email</td><td>First Name</td><td>Last Name</td><td>Age</td><td>Role</td><td>Action</td></tr>");
        });
    function deleteUser(login, str){
        $.ajax({
            type: "delete",
            url: "service/"+login,
            success: function() {
                $(str).animate({backgroundColor: "red"}, 1500)
                      .hide(1000, function() {
                            $(this).remove();
                    })
            }
        })
    }
    function updateUser(login, str) {
        $('input[type=hidden]').val('');
        $.ajax({
            type: "GET",
            url: "service/"+login,
            success: function (user) {
                var i = 2;
                $.each(user, function(index, value) {// fills in the form of user data
                    if (index == "_id") {
                        //$("#form1 input[type=hidden]").val(value);
                        $("<input/>", {
                            "type": "hidden",
                            "name": "_id",
                            "id": "_id",
                            "value": value
                        }).prependTo("#form1 table");
                        return true;
                    }
                    if (index == "login") {
                        $("#form1 input")[1].disabled = true;// disabled field "login"
                        $("#form1 td input#login").next().addClass("error checked");// field "login" is valid
                        $("<input/>", {
                            "type": "hidden",
                            "name": "login",
                            "id": "login",
                            "value": value
                        }).insertAfter("#form1 table input#_id");
                    }
                    if (i == 4)
                        i++;
                    $("#form1 input")[i].value = value;
                        i++;
               });
            }
        });
        openForm();
        $('#submitCreate').hide();
        $("#submitUpdate").show("slow");
        $('#form1 #submitUpdate').on('click', function (event) { //send to the server data from the form
            event.preventDefault();
            var arrData = $('#form1').serializeArray();
            $.ajax({ // update information about user
                type: "PUT",
                url: "/service",
                data: $('#form1').serialize(),
                dataType: "html",
                success: function(msg) {
                    if (msg == "error")
                        alert('Internal Server Error!');
                    else {
                        $("input[type=hidden]").remove();// delete hidden fields
                        $.each(arrData, function(index, element){
                            var i = 2;
                            $(str).find("td")[i].textContent = element.value;
                            i++;
                            });
                        $("#form1").hide(1000);
                        $("#form1 input[type=text],#form1 input[type=password]").val('');
                        $("#main_menu").show(1000);
                    }
                }
            });
        })
    }

    function drawTable(msg) //when page load draw table from DB
    {
        if (msg) {
            // draw table for users
            $.each(msg, function (index, element) {
                var row = $('<tr></tr>').addClass('bar');
                var td;
                var firstTd = $("<td>User " + index + "</td>");
                $.each(element, function (index, element) {
                    if (index == "_id") // ignore id users
                        return true;
                    if (index == "birthday") // calculate age users
                    {
                        var date = new Date().getFullYear();
                        var yearsbirth = new Date(element).getFullYear();
                        var age = date - yearsbirth;
                        element = age + " years";
                    }
                    td = $("<td></td>").text(element);
                    row.append(td);
                    table.append(row);
                });
                row.append(td).prepend(firstTd);// add header row
                var lastTd = $("<td><a href='#' id='deleteUser'>Delete User</a>&nbsp;&nbsp;<a href='#' id='updateUser'>Update User</a></td>");
                row.append(lastTd);
            });
        }
        else
            alert("Error! No data.");
        $('#main_menu').append(table);
    }
     $.validator.addMethod('validLogin', function (value, element) {// add method for validate login
        var result = true;
        if(!(/^[a-zA-Z][a-zA-Z0-9_\.]+$/.test(value))){
        return false;
            }
        return result;
    }, '');
    function openForm() {
        $("#form1 input#login").next().removeClass("error checked");
        $("#main_menu").hide(1000);
        $("#form1").show(1000);
        $("#form1").validate({
            focusInvalid: false,
            focusCleanup: true,
            rules: {
                login: {
                    required: true,
                    validLogin: true,
                    minlength: 4,
                    maxlength: 16,
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
                    required: true,
                    minlength: 6,
                    maxlength: 16
                },
                passwordConf: {
                    required: true,
                    equalTo: '#password'
                },
                email: {
                    required: true,
                    email: true
                },
                firstName: {
                    required: true,
                    rangelength: [2, 20],
                    lettersonly: true
                },
                lastName: {
                    required: true,
                    rangelength: [2, 20],
                    lettersonly: true
                },
                birthday: {
                    required: true,
                    date: true
                }
            },
            messages: {
                login: {
                    validLogin: "Login must have latin words and numbers(must start on words)",
                    remote: "This name already exist"
                },
                birthday: {
                    date: "Date must to be in MM/DD/YYYY format"
                }
            },
            success: function(label) {
                label.html("&nbsp;").addClass("checked");
            },
            highlight: function(element) {
               // $(element).next().attr("class", "error");
                $(element).next().removeClass("checked");
            }
        });
        $("#form1 input").on("blur", function(){
            enableSubmit();
        });

    }

    function enableSubmit()// enabled submit when form valid
    {
        var p = $(".checked").length;
        if (p == 7) {
            ($("#submitCreate").attr("disabled", false));
            ($("#submitUpdate").attr("disabled", false));
            return true;
        }
        else {
            ($("#submitCreate").attr("disabled", true));
            ($("#submitUpdate").attr("disabled", true));
        }
    }
    $(function () { // add calendar to input "birthday"
        $("#birthday").datepicker();
    });

    $('#form1 #submitCreate').on('click', function (event) { //send to the server data from the form
        event.preventDefault();
        var arrData = $('#form1').serializeArray();
        $.ajax({
            type: "POST",
            url: "service",
            data: $('#form1').serialize(),
            dataType: "html",
            success: function (msg) { // add new user to DB

                if (msg == 'error') {
                        alert('Internal Server Error!');
                }
                else {  // draw new str and add it to table
                    var td1 = "";
                    var row = $("<tr></tr>").addClass("newRow");
                    var firstTd = $("<td>New User</td>");
                    row.append(firstTd);
                    $.each(arrData, function (index, value) {
                        if (arrData[index].name == "_id") // ignore _id
                            return true;
                        if (arrData[index].name == "passwordConf") // ignore password confirm
                            return true;
                        if (arrData[index].name == "birthday") {
                            var date = new Date().getFullYear();
                            var yearsbirth = new Date(arrData[index].value).getFullYear();
                            var age = date - yearsbirth;
                            arrData[index].value = age + " years";
                        }
                        td1 = arrData[index].value;
                        var td = $("<td></td>");
                        td.append(td1);
                        row.append(td);

                    });
                    var tdLast = $("<td><a href='#' id='deleteUser'>Delete User</a>&nbsp;&nbsp;<a href='#' id='updateUser'>Update User</a></td>");
                    row.append(tdLast);
                    $("table.foo tr:last").after(row);
                }
            }
        });
        $("#form1").hide(1000);
        $("#form1 input[type=text],#form1 input[type=password]").val('');
        $("#main_menu").show(1000);
        $("label.checked").removeClass("checked error");
        //setTimeout(function() {$(".newRow").removeClass("newRow").addClass("bar") }, 5000);
        setTimeout(function () {
            $(".newRow").animate({backgroundColor: "#8B8989"}, 2500)
        }, 4000);
    });
});

	