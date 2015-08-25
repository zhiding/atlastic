(function ($) {
  
  var csrftoken = $.cookie('csrftoken');

  function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }

  function validateEmail(input) {
    var reg = new RegExp(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,6})$/);
    return reg.test(input);
  }

  function validatePwd(input) {
    var strong = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var medium = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var normal = new RegExp("(?=.{6,}).*", "g");
    if (!normal.test(input)) {
      return "not enough"
    }
    else if (strong.test(input)) {
      return "strong"
    }
    else if (medium.test(input)) {
      return "medium"
    }
    else {
      return "weak"
    }
  }

  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    }
  });

  $("#login_btn").on("click", function () {
    username = $("#login_name").val().trim();
    password = $("#login_pwd").val();
    $.ajax ({
      url: "/account/user_login/",
      type: "POST",
      dataType: "json",
      data: {
        username: username,
        password: password,
      },
      success: function (response) {
        if (response._status == 0) {
          window.location.replace(response._redirect);
        }
        else if (response._status == 1) {
          $("#login_err_msg").html("<span class='glyphicon glyphicon-exclamation-sign'></span> This account has been disabled");
        }
        else {
          $("#login_err_msg").html("<span class='glyphicon glyphicon-remove-sign'></span> Username and password were incorrect");
        }
      },
      error: function () {
      }
    });
  });
  
  $("#create_account").on("click", function () {
    username = $("#register_name").val().trim();
    email = $("#register_email").val();
    password = $("#enter_pwd").val();
    $.ajax ({
      url: "/account/user_register/",
      type: "POST",
      dataType: "json",
      data: {
        username: username,
        email: email,
        password: password,
      },
      success: function (response) {
        if (response._status == 0) {
          console.log(response._msg);
        }
        else {
          window.location.replace('/account/login/');
        }
      },
      error: function () {
      }
    });
  });

  $("#register_btn").on("click", function () {
    window.location.replace('/account/register/');
  });

  $("#return_login").on("click", function () {
    window.location.replace('/account/login/');
  });

  // register form validation
  $("#register_name").on("focusout", function () {
    $this = $(this);
    username = $this.val().trim();
    if (username == "") {
      return false;
    }
    $.ajax({
      url: "/account/user_validate/",
      type: "POST",
      dataType: "json",
      data: {
        username: username,
        field: "username",
      },
      success: function (response) {
        if (response._status == 0) {
          $("#validate_username").html("<span class='glyphicon glyphicon-remove-sign'></span> "+response._msg).css("color", "red");
        }
        else {
          $(" #validate_username").html("");
        }
      },
      error: function () {
      }
    });
  });

  $("#register_email").on("focusout", function () {
    $this = $(this);
    email = $this.val().trim();
    if (email == "") {
      return false;
    }
    if (validateEmail(email)) {
      $("#validate_email").html("");
    }
    else {
      $("#validate_email").html("<span class='glyphicon glyphicon-remove-sign'></span> Invalid email address").css("color", "red");
    }
  });
  
  $("#enter_pwd").on("focusout", function () {
    $this = $(this);
    enter_pwd = $this.val();
    if (enter_pwd.trim() == "") {
      return false;
    }
    console.log(enter_pwd);
    pwd_strength = validatePwd(enter_pwd);
    console.log(pwd_strength);
    $(".validate-pwd>.progress").hide();
    $(".validate-pwd>span:first-child").hide();
    switch (pwd_strength) {
      case "not enough":
        $(".validate-pwd>span:first-child").show().css("color", "red");
        break;
      case "weak":
        $(".validate-pwd>.progress").show()
        $(".progress-bar.pwd-weak").progressbar(33).text("Weak");
        $(".progress-bar.pwd-medium").progressbar(0).text("");
        $(".progress-bar.pwd-strong").progressbar(0).text("");
        break;
      case "medium":
        $(".validate-pwd>.progress").show()
        $(".progress-bar.pwd-weak").progressbar(33).text("");
        $(".progress-bar.pwd-medium").progressbar(33).text("Medium");
        $(".progress-bar.pwd-strong").progressbar(0).text("");
        break;
      case "strong":
        $(".validate-pwd>.progress").show()
        $(".progress-bar.pwd-weak").progressbar(33).text("");
        $(".progress-bar.pwd-medium").progressbar(33).text("");
        $(".progress-bar.pwd-strong").progressbar(34).text("Strong");
        break;
    }
  });

  $("#re_enter_pwd").on("focusout", function () {
    $this = $(this);
    enter_pwd = $("#enter_pwd").val();
    if (enter_pwd.trim() == "") {
      $(".validate-re-pwd").html("");
      return false;
    }
    re_enter_pwd = $this.val();
    if (re_enter_pwd.trim() == "") {
      return false;
    }
    if (enter_pwd === re_enter_pwd) {
      $(".validate-re-pwd").html("");
    }
    else {
      $(".validate-re-pwd").html("<span class='glyphicon glyphicon-remove-sign'></span> Re-enter password doesn't match").css("color", "red");
    }
  });


}) (jQuery);


