$(function () {
    function initImg() {
        console.log(1)
        axios.get('/my/userinfo').then(function ({ data: res }) {
            if (res.code == 0) {
                console.log(res);
                $('#image').prop('src', res.data.user_pic);
            }
        }).catch(function (error) {
            console.log(error)
        })
    }
    initImg();
    $('#btnChooseImg').on('click', function () {
        // 当我们点击选择图片的按钮的时候，模拟文件框的点击事件
        $('#file').click();
    })
    let file = null;
    $('#file').on('change', function () {
        const files = this.files;
        // 如果用户输入的文件长度为0，返回
        if (files.length == 0) {
            // 如果用户没有上传图片设置为null
            file = null;
            return;
        }
        // 如果用户有上传图片，将这个图片复制给file
        file = files[0];

        // 通过createObjectURLh获取文件的url地址
        let url = URL.createObjectURL(files[0]);
        // 设置img标签的url地址
        $('#image').prop('src', url);
    })
    // 给上传按钮定义点击事件
    $('#btnUploadImg').on('click', function () {
        // 如果file对象为null代表用户没有上传图片
        if (!file) {
            layer.msg('请选择图片')
            return
        }
        let fw = new FileReader();
        console.log(file);
        // 通过FileReader对象去获取文件的base64编码格式
        fw.readAsDataURL(file);
        fw.onload = function () {
            // console.log(this.result)
            // 当我们获取到图片对应的base64编码的时候，发送ajax请求
            axios.patch('/my/update/avatar', {
                avatar:this.result
            }).then(function ({ data:res}) {
                if (res.code == 0) {
                    layer.msg(res.message);
                    console.log(res);
                    window.parent.getInfo();
                } else {
                    layer.msg(res.message)
                }
            })
        }
    })
})