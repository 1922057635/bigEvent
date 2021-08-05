$(function () {
    // 切换登录的注册的页面
    $('#link-reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link-login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    })
    // 给注册页面的input输入框自定义验证条件
    layui.form.verify({
        usename: [/^[a-zA-Z0-9]{1,10}$/, "用户名为1到10位的字母和数字"],
        psd: [/^\S{6,15}$/, "密码为6到15位的非空字符"],
        repsd: function (value) {
            if ($('.reg-box [name=password]').val() !== value) return "两次的密码不一致"
        }
    })
// 给注册表单添加提交事件
    $('.reg-box form').on('submit', function (e) {
        e.preventDefault();
        axios.post('/api/reg', $(this).serialize()).then(response => {
            console.log(response);
            let data = response.data;
            if (data.code === 0) {
                layer.msg('注册成功');
                $('#link-login').click();
            } else {
                layer.msg(data.message);
            }
        })
    })
    // 给登录表单添加提交事件
    $('.login-box form').on('submit', function (e) {
        e.preventDefault();
        axios.post('/api/login', $(this).serialize()).then(({ data: res }) => {
           
            if (res.code === 0) {
                 // 登录成功,将服务器返回的token值放到本地里面，供后续的使用;
                localStorage.setItem('token', res.token);
                location.href="/home.html";
                layer.msg('登录成功');
            } else {
                // 
                layer.msg('登录失败');
                // 如果登录失败就删除本地对应的记录信息
                localStorage.removeItem('token');
            }
        })
    })
    
})