$(function () {
    function getUserInfo() {
        axios.get('/my/userinfo').then(function ({ data:res}) {
            console.log(res)
            // 这里使用layui的layui.form.val方法给表单进行填充
            layui.form.val('user-form', res.data);
        }).catch((error) => {
            console.dir(error);
        })
    }
    getUserInfo();
    layui.form.verify({
        nickname: [/^\S{1,10}$/, "请输入1到10位的非空字符"],  
    })
    $('[lay-filter="user-form"]').on('submit', function(e) {
        e.preventDefault();
        console.log($(this))
        console.log($(this).serialize());
        let data = $(this).serialize();
        axios.put('/my/userinfo', data).then(({ data: res }) => {
            console.log(res);
            if (res.code == 0) {
                layer.msg('更新用户信息成功');
                // 调用父窗口中的getInfo函数重新请求和渲染数据
                window.parent.getInfo();
            } else {
                layer.msg(res.message);
            }
        })
    })
    $('[type=reset]').on('click', function (e) {
        e.preventDefault();
        getUserInfo();
    })
})