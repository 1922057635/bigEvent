
$(function () {
    // 给退出登录按钮注册点击事件
    $('.logout').click(function () {
        // 打开layui的弹出层，提示用户是否退出
        layer.confirm('你确定退出吗？', {
            icon: 3
            , title: '提示'
        }, function (index) {
            localStorage.removeItem('token');
            location.href = "/index.html";
            layer.close(index)
        })
    })
    // 封装一个请求用户信息的接口的函数
    
    // 获取用户的信息
    getInfo();
    // 渲染用户的信息
   
 
})
  // 封装一个请求用户信息的接口的函数
  function getInfo() {
    // 当我们访问有权限的接口的时候，需要加上这个请求头来进行身份验证
    axios.get('/my/userinfo').then(({ data: res }) => {
        console.log(res);
        // 成功获取到用户的数据之后，将获取到的用户数据渲染到页面上
        readerUserData(res.data);
    }).catch(error => {
        // 如果请求的时候发现token是假的，或者说没有就清空token返回登录页面
        console.dir(error)
        if (error.response.status == 401) {
            localStorage.removeItem('token');
            location.href = "/index.html";
        }
    })
}

  // 渲染用户的信息
  function readerUserData(data) {
    // 渲染头部区域

    // 获取用户的名字，如果有nickname就是用这个，如果没就是要用户名
    let name = data.nickname || data.username;
    let imgPicName = name[0].toUpperCase();
    if (data.user_pic) {
        // 如果有图片数据，就渲染这个图片区域，文字图片是不用显示的
        $('#header-avatar').html(` <img src="${data.user_pic}"
        class="layui-nav-img">
    个人中心`)
    } else {
        // 没有图片数据，就渲染文字图像区域，
        $('#header-avatar').html(` 
    <div class="text-avatar">${imgPicName}</div>
    个人中心`)
    }

    // 渲染侧边栏区域
    if (data.user_pic) {
        // 如果有图像
        $('.user-info-box').html(`<img src="${data.user_pic}"
        class="layui-nav-img">
    
    <span class="welcome">&nbsp;欢迎&nbsp; ${name}</span>`)
    } else {
        // 没有图像
        $('.user-info-box').html(`
    <div class="text-avatar">${imgPicName}</div>
    <span class="welcome">&nbsp;欢迎&nbsp; ${name}</span>`)
    
    }
    // 重新渲染DOM，由于动态生成的元素而造成的动画的缺少
    // 第一个参数是指定渲染的哪一个具体的结构，第二个参数可以和dom元素身上的lay-filter="header-nav"属性配合形成更加细致的过滤 
    layui.element.render('nav','header-nav');
  
}

// 定义一个将侧部导航栏高亮的函数
function setHeight(kw) {
    // console.log('kw');
    $('.layui-nav-tree dd').removeClass('layui-this');
    $(`.layui-nav-tree dd:contains("${kw}")`).addClass('layui-this');
}