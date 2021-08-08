$(function () {
    // 定义一个渲染所有文章的函数
    function getAllArticle() {
        axios.get('/my/cate/list').then(function ({ data:res}) {
            let rows = [];
            res.data.forEach((value, index) => {
                rows.push(` <tr>
                <td>${index+1}</td>
                <td>${value.cate_name}</td>
                <td>${value.cate_alias}</td>$</td>
                <td>
                    <button type="button" class="layui-btn layui-btn-xs btn-edit" data-id="${value.id}">修改</button>
                    <button type="button" class="layui-btn layui-btn-danger layui-btn-xs btn-delete" data-id="${value.id}">删除</button>
                </td>
            </tr>`)
            })
            $('tbody').html(rows);
        })
    }
    getAllArticle();
    let index = null;
    // 给添加文章类别的按钮添加点击事件
    $('#btnShowAdd').click(function () {
        index=layer.open({
            title: '添加文章类别',
            anim: 1,
            type:1,
            area: ['500px', '250px'],
            // 这里的模板字符串是通过获取script里面的文本内容获取的
            content: $('#template-add').html(),
        });
    })
    // 给文章类别的列表添加验证信息
    layui.form.verify({
        name: [/^\S{1,10}$/,"分类名称为1-10位非空字符"],
        alies:[/^[a-zA-Z0-9]{1,15}$/,"分类别名为1到15位的字母或者数字"]
    })
    // 通过事件的委托给文章列表添加submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        console.log(1)
        // 获取列表中的所有数据
        let data = $(this).serialize();
        // 调用接口去添加数据数据
        axios.post('/my/cate/add', data).then(function ({ data:res}) {
            console.log(res)
            // 如果成功
            if (res.code == 0) {
                layer.msg('添加成功');
                // 重新获取文章的分类信息
                getAllArticle();
                // 关闭弹出层
                layer.close(index);
            }
        })
    })

    let index_del = null;
    // 通过事件的委托给修改文章列表的点击事件
    $('tbody').on('click', '.btn-edit', function () {
         // 获取修改的类别id
         let id = $(this).attr('data-id');
        if (id == 1 || id == 2) {
            layer.msg("管理员不允许修改这条数据");
            return
        }
        // 当点击修改按钮的时候弹出修改层
        index_del=layer.open({
            title: '修改文章分类',
            anim: 1,
            type:1,
            area: ['500px', '250px'],
            // 这里的模板字符串是通过获取script里面的文本内容获取的
            content: $('#template-edit').html(),
        });
        // console.log($(this).attr('data-id'));
       
        // 通过id查找对应的类别并且回显数据
        axios.get('/my/cate/info', { params: { id } }).then(function ({ data:res}) {
            // console.log(res)
            // 如果获取成功
            if (res.code == 0) {
                // 回显数据
                layui.form.val('form-edit', res.data);
            }
        })
    })
    $('body').on('submit', '#form-edit', function (e) {
        // console.log(11);
        e.preventDefault();
        let data = $(this).serialize();
        console.log(data);
        axios.put('/my/cate/info', data).then(function ({ data:res}) {
            if (res.code == 0) {
                layer.msg(res.message);
                getAllArticle();
                // console.log(index_del);
                layer.close(index_del);
               }
        })
    })
    // 给删除按钮添加点击事件
    $('tbody').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id');
        if (id == 1 | id == 2) {
            layer.msg("不能删除前两天数据");
            return
        }
        console.log(id);
        layer.confirm('确认删除吗？', {icon: 3, title:'提示'}, function(index){
            axios.delete('/my/cate/del', { params: { id } }).then(function ({ data: res }) {
                console.log(res)
                if (res.code == 0) {
                    layer.msg(res.message);
                    getAllArticle();
                    layer.close(index);
                }
            })
           
          });
    })
})