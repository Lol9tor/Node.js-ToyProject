window.App = {
    Views: {},
    Models: {},
    Collections: {},
    Routes: {}
};

_.templateSettings = {
    interpolate: /\<\@\=(.+?)\@\>/gim,
    evaluate: /\<\@(.+?)\@\>/gim,
    escape: /\<\@\-(.+?)\@\>/gim
};

$.extend($.validator.messages, {
    required: "This field is required.",
    remote: "This login busy.",
    email: "Please enter a valid email address.",
    equalTo: "Passwords do not match."
});