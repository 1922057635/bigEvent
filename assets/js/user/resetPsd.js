$(function () {
    layui.form.verify({
        psd: [/^\S{6,15}$/, "密码的长度为6到15位"],
        prepsd: function (value) {
            console.log(value,$('[name="old_pwd"]').val())
            if (value == $('[name="old_pwd"]').val()) {
                return "重置的密码和旧密码一样";
            }
        },
        confirmpsd: function (value) {
            if (value !== $('[name="new_pwd"]').val()) {
                return "两次输入的密码不一致"
            }
        }
    })
    $('#formUpdatePwd').on('submit', function (e) {
        e.preventDefault();
        axios.patch('/my/updatepwd', $(this).serialize()).then(function ({ data:res}) {
            if (res.code == 0) {
                layer.msg(res.message);
                $('[name="old_pwd"]').val("");
                $('[name="new_pwd"]').val("");
                $('[name="re_pwd"]').val("");
            } else {
                layer.msg(res.message);
            }
        })
    })
})