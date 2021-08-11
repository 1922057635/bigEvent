$(function () {
    let total = 3;
    const options={
        elem: 'page-box' ,//注意，这里的 test1 是 ID，不用加 # 号
         //数据总数，从服务端得到
        limit:2,
        layout: ['count', 'page', 'prev', 'next', 'limit', 'skip'],
        jump: function (obj, first) {
            //obj包含了当前分页的所有参数，比如：
            // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            // console.log(obj.limit); //得到每页显示的条数
            // 每次切换页码的时候都判断下当前的分类id和所属状态
            let cate_id = $('[name="cate_id"] option:selected').prop('value');
            let state = $('[name="state"] option:selected').prop('value');
            // console.log(state);
            console.log(obj)
            options.count = obj.count;
            console.log(first)
            getDataArtcle(obj.curr, obj.limit, cate_id, state);
            // options.count = total;
            //首次不执行
            if (!first) {
                //do something
                console.log(11)
                getDataArtcle(obj.curr, obj.limit,cate_id,state);
            }
        }
          
        
    }
    layui.use('laypage', function(){
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render(options);
    });
    
    // 根据条件筛选数据，并且渲染到页面上去
    function getDataArtcle(pagenum, pagesize, cate_id, state) {
        const params = {
            pagenum,
            pagesize
        };
        // 只要传入的有数据哪怕是空字符串也执行
        if (cate_id!=undefined) params.cate_id = cate_id;
        if (state!=undefined) params.state = state;
        console.log(params);
        axios.get('/my/article/list', {
            params
        }).then(function ({ data:res}) {
            console.log(res)
            // 获取数据成功
            if (res.code == 0) {
                options.count = res.total;
                // total=res.total
                let rows = [];  
                res.data.forEach(value => {
                   
                    let time = new Date(value.pub_date);
                    rows.push(`<tr data-id="${value.id}">
                    <td data-id="${value.id}">${value.title}</td>
                    <td>${value.cate_name}</td>
                    <td>${time.toLocaleString()}</td>
                    <td>${value.state}</td>
                    <td>
                    <button type="button" class="layui-btn layui-btn-xs btn-edit">编辑</button>
                    <button type="button" class="layui-btn layui-btn-danger layui-btn-xs btn-delete">删除</button>
                  </td>
                </tr>`)
                   
                })
                $('tbody').html(rows);
            }
        })  
    }
    getDataArtcle(1, 2);

    // 初始化下拉菜单里面的数据
    function getArticleSort() {
        axios.get('/my/cate/list').then(({ data: res }) => {
            console.log(res);
            // 获取文章类别信息成功
            if (res.code == 0) {
                
                const rows = [];
                res.data.forEach(value => {
                    rows.push(`<option value="${value.id}">${value.cate_name}</option>`);
                })
                $('[name="cate_id"]').append(rows);
                layui.form.render('select');
            }
        })
    }
    // 初始化下拉菜单里面的数据
    getArticleSort();

    // 定义筛选表单的事件
    $('.layui-form-pane').on('submit', function (e) {
        console.log(e);
        e.preventDefault();
        let cate_id = $('[name="cate_id"] option:selected').prop('value');
        let state = $('[name="state"] option:selected').prop('value');
        // console.log(cate_id,state)
        getDataArtcle(1, 2, cate_id, state);
    })


    // 浏览文章的点击事件
    $('tbody').on('click', 'tr td:first-child', function () {
        let id = $(this).attr('data-id');
        console.log(id)
        axios.get('/my/article/info', {
            params: {id}
        }).then(({ data: res }) => {
            console.log(res)
            if (res.code == 0) {
                let time = new Date(res.data.pub_date);
                layer.open({
                    title: '浏览文章',
                    area: ['85%', '85%'],
                    type: 1,
                    content:`<div class="artinfo-box">
                    <h1 class="artinfo-title">${res.data.title}</h1>
                    <div class="artinfo-bar">
                      <span>作者:${res.data.username}</span>
                      <span>发布时间:${time.toLocaleString()}</span>
                      <span>所属分类:${res.data.cate_name}</span>
                      <span>状态:${res.data.state}</span>
                    </div>
                    <hr>
                    <h3>文章的封面</h3>
                    <img src="http://www.liulongbin.top:3008${res.data.cover_img}" alt="" class="artinfo-cover">
                    <h3>文章的内容</h3>
                    <div class="content">${res.data.content}</div>
                    </div>`,
                  });
            }
        })
       
    })
    // 给编辑按钮注册点击事件
    $('tbody').on('click', '.btn-edit', function (e) {
        console.log(e.currentTarget);
        console.log($(e.currentTarget).parents('tr').attr('data-id'));
        layer.open({
            title: '编辑文章',
            area: ['90%', '85%'],
            type: 1,
            scrollbar: false,
            content: $('#edit-article').html(),
          });     
    })
    // 给删除按钮注册点击事件
    $('tbody').on('click', '.btn-delete', function (e) {
        
        layer.confirm('确定删除吗？', {icon: 3, title:'提示'}, function(index){
            //do something
            console.log($(e.currentTarget).parents('tr').attr('data-id'));
            let id = $(e.currentTarget).parents('tr').attr('data-id');
            axios.delete('/my/article/info', {
                params: {
                id
            }}).then(({ data: res }) => {
                if (res.code == 0) {
                    layer.msg(res.message);
                    getDataArtcle(1, 2);
                } else {
                    layer.msg(res.message)
                }
            })
            layer.close(index);
          });
    })
})