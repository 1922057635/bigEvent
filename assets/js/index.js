$(function () {
    $('#link-reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link-login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
})