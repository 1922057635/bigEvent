// 定义一个查询参数的对象
const q = {
    pagenum: 1,
    pagesize: 2,
    cate_id: '',
    state:'',
}

// 初始化下拉菜单里面的数据
function getSelectData() {
    axios.get('/my/cate/list').then(({ data: res }) => {
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

getSelectData();

// 定义表单的提交事件
$('.layui-form-pane').on('submit', function (e) {
    e.preventDefault();
    let cate_id = $('[name="cate_id"] option:selected').prop('value');
    let state = $('[name="state"] option:selected').prop('value');
    // 当我们点击提交按钮的时候将查询参数设置我们要查询的值，并且查询的页码为1也就是第一页的数据
    q.cate_id = cate_id;
    q.state = state;
    q.pagenum = 1;
    getArticleData();
})

// 定义重置按钮的提交事件

$('[type="reset"]').on('click', function () {
    // 当我们点击重置按钮的时候将cate_id和state的值都设置为空，并且页码数位1
    q.cate_id = '';
    q.state = '';
    q.pagenum = 1;
    getArticleData();
})



// 定义一个渲染分页的函数
function readerPage(total) {
    // 使用layui的分页组件需要注意：
    // layui他只是帮助我们实现一些前端的页面，没有任何的逻辑可言，每次我们改变分页的状态，我都触发我们定义的回调函数jump，在jump里面我们可以写一写我们想要实现的功能，比如发送异步请求数据，调用这个回调的时候他给我们传递了必要的参数，比如分页的页码，就是各种分页的信息，我们通过这些信息去完成相应的功能。里面的参数一般都是动态设定的，根据相应的操作得到我们想要的值
    layui.laypage.render({
        elem: 'page-box',//指定要渲染的元素id
        limit: q.pagesize,//指定每一页的个数
        count: total,//指定这个分页控件包含的所有数据的个数，一般是由服务器返回过来的。
        layout: ['count', 'page', 'prev', 'next', 'limit', 'skip'],//这个属性设置我们要显示的分页控件
        limits:[2,4,6,8,10],//这个属性是指代每一页显示多少条数据，一般配合上面的layout里面的limit一起显示
        curr:q.pagenum,//curr属性是指代当前高亮的哪一个页码，这个页码就是我们查询参数里面的pagename
        // jump是一个回调函数，每次当分页里面的数据发生变化都会触发这个事件（如当我们点击下一页，点击页号的时候都会触发），具体触发之后做什么事情需要我们自己去设定。
        jump: function (obj, first) {
            //obj包含了当前分页的所有参数，比如：
            // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
            // console.log(obj.limit); //得到每页显示的条数
            console.log(obj)
            console.log(first)
            // 每一次触发这个分页回调的时候都应该设置一下当前我们要查询的是第几页的数据
            q.pagenum = obj.curr;
            q.pagesize = obj.limit;
            // 注意这个时候我们就不在需要设置查询参数里面的分类id和状态了，因为如果我们是按照这样的查询条件去查询的那么q里面的字段还没有被重置，里面的值依然是我们设置的查询值
            console.log(q);
            // options.count = total;
            //首次不执行,这个first只要在第一次改变分页的状态的时候才会触发，其他时候是不会触发的，所以我们应该在if条件的前面做一些初始化的操作
            if (!first) {
                getArticleData()
            }
        }
    })
}
// 定义一个渲染数据的函数
function getArticleData() {
    axios.get('/my/article/list', { params: q }).then(({ data: res }) => {
        if (res.code == 0) {
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
            // 每一次服务器请求完数据之后，重新渲染分页里面的内容
            readerPage(res.total)
        }
    })
}
// 给删除按钮定义点击事件
$('tbody').on('click', '.btn-delete', function (e) {
        
    layer.confirm('确定删除吗？', {icon: 3, title:'提示'}, function(index){
        //do something
        // 获取到当前删除元素的id值
        let id = $(e.currentTarget).parents('tr').attr('data-id');
        axios.delete('/my/article/info', {
            params: { id }
        }).then(({ data: res }) => {
            if (res.code == 0) {
                layer.msg(res.message);
                // 如果当前页不是第一页的数据，并且这一页只剩下一行，那么我们删除完之后在去请求这一页的数据就会返回一个空数据，渲染出来就是空页面，为了防止出现空页面，当这一页就剩下一行的时候，我们的查询参数减去已，去查询上一页的内容
                if (q.pagenum > 1 && $('tbody tr').length == 1) q.pagenum--;
                // 如果删除成功重新加载当前页的数据，查询参数不变
                getArticleData();
            } else {
                layer.msg(res.message)
            }
        })
        layer.close(index);
      });
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
getArticleData();