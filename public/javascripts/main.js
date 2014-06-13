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
            updateUser(userLogin);
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
    function updateUser(login) {
        $.ajax({
            type: "GET",
            url: "service/"+login,
            success: function (user) {
                var i = 0;
                $.each(user, function(index, value) {// fills in the form of user data
                    if (index == "_id")
                        return true;
                    if (index == "login") {
                        $("#form1 input")[i].disabled = true;
                        checkExistsMessageOk($("#form1 input")[i]);
                    }
                    if (i == 2)
                        i++;
                    $("#form1 input")[i].value = value;
                        i++;
               });
               // $("#form1 input:last").show("Update user");
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
                url: "service/"+login,
                data: $('#form1').serialize(),
                dataType: "html",
                success: function(msg) {
                    if (msg == "error")
                        alert('Internal Server Error!');
                    else {
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

    function openForm() {
        $("#main_menu").hide(1000);
        $("#form1").show(1000);
        $.each($("#form1 input"), function (index, element) {	// show/hide hint
            $(element).on("focus", function (event) { // show hint
                $(element).next("span").show(1000);
                $(element).parent().find(".error").hide();// hide hint about error when onfocus input
                $(element).parent().find(".complete").remove();// remove hint about complete when onfocus input
            });
            $(element).on("blur", function (event) { // hide hint and validate form
                $(element).next("span").hide(600);
                //check input for valid data
                var inputId = $(element).attr("id");
                switch (inputId) {
                    case "login":
                    {
                        if (!(/^[a-zA-Z][a-zA-Z0-9_\.]{3,11}$/.test($(element).val())) || !($(element).val()))
                            showError(element);
                        /*$.ajax({
                         type: "GET",
                         url: "/check",
                         data: {login: $('#login').val()},
                         success: function (answer){
                         if (answer == true) {

                         }
                         else
                         alert("this login already exists!")
                         }
                         });*/
                        else
                            checkExistsMessageOk(element);
                        break;
                    }
                    case "password":
                    {
                        if (!(/^[a-zA-Z0-9]+$/.test($(element).val())) || !($(element).val()) || !(($(element).val().length) >= 6))
                            showError(element);
                        else
                            checkExistsMessageOk(element);
                        passwordConf = $(element).val();
                        break;
                    }
                    case "passwordConf":
                    {
                        if (!(($(element).val()) == passwordConf) || !($(element).val()))
                            showError(element);
                        else
                            checkExistsMessageOk(element);
                        break;
                    }
                    case "email":
                    {
                        if (!(/^[a-zA-Z0-9_\-\.]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/.test($(element).val())) || !($(element).val()))
                            showError(element);
                        else
                            checkExistsMessageOk(element);
                        break;
                    }
                    case "firstName":
                    {
                        if (!(/^[a-zA-Z]+$/.test($(element).val())) || !($(element).val()))
                            showError(element);
                        else
                            checkExistsMessageOk(element);
                        break;
                    }
                    case "lastName":
                    {
                        if (!(/^[a-zA-Z]+$/.test($(element).val())) || !($(element).val()))
                            showError(element);
                        else
                            checkExistsMessageOk(element);
                        break;
                    }
                    case "birthday":
                    {
                        if (!($(element).val()))
                            showError(element);
                        else
                            checkExistsMessageOk(element);
                        break;
                    }
                }
                // end validation
                enableSubmit();
            });
        });
    }

    function enableSubmit()// enabled submit when form valid
    {
        var p = $(".complete").length;
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

    function showError(element) {
        $(element).parent().find(".error").delay(650).show(600);
        return true;
    }

    function checkExistsMessageOk(element) {
        if ($(element).parent().find("span.complete").length)// exists element
            return true;
        $(element).parent().append("<span class='complete'>OK</span>"); //add element and draw it
        $(".complete").delay(650).show(600);
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
        //setTimeout(function() {$(".newRow").removeClass("newRow").addClass("bar") }, 5000);
        setTimeout(function () {
            $(".newRow").animate({backgroundColor: "#8B8989"}, 2500)
        }, 4000);
    });
});

	