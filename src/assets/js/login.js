const $ = window.jQuery = require('jquery')
// $(document).on("click", "#signupPage", function () {
//   $("#formHead").text("Sign Up");
//   $(".facebook span b").text("Sign up with Facebook");
//   $(".google span b").text("Sign up with Google");
//   $(".form-link").html(
//     "<div class='check_box2'>" +
//     "<div><input type='checkbox'> <span>I agree to the</span><a href='#'>Terms of Service</a>" +
//     "<span>and</span> <a href='#'>Privacy Policy</a></div>" +
//     "</div>"
//   );
//   $(".form-signup").html(
//     "<div class='form-signup'>" +
//     "<span>Have an account? " +
//     "<a class='link signup-link' id='loginPage'>Login</a></span>" +
//     "</div>"
//   );
//   $(".button-field").html(
//     "<button id='#signupBtn'>Sign Up</button>"
//   );
// });



// $(document).on("click", "#loginPage", function () {
//   $("#formHead").text("Login");
//   $(".facebook span b").text("Login with Facebook");
//   $(".google span b").text("Login with Google");
//   $(".form-link").html(
//     "<div class='check_box'><input type='checkbox'> <span> Remember me</span></div>" +
//     "<div class='forget_div'>" +
//     "<a href='#'' class='forgot-pass'>Forgot password?</a>" +
//     "</div>"
//   );
//   $(".form-signup").html(
//     "<div class='form-signup'>" +
//     "<span>Don't have an account? " +
//     "<a class='link signup-link' id='signupPage'>Sign Up</a></span>" +
//     "</div>"
//   );
//   $(".button-field").html(
//     "<button id='#loginBtn'>Log in</button>"
//   );
// })

// $(document).ready(function($) {

$(document).on('click', '.field.input-field i.bx.eye-icon', function () {
  var checkType = $('input#password').attr('type');
  if (checkType === 'password') {
    $('input#password').attr('type', 'text');
  }
  else {
    $('input#password').attr('type', 'password');
  }

})

  // });