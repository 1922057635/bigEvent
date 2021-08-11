$(function () {
  // 这个常量 q 是查询的参数对象
  const q = {
    // 页码值
    pagenum: 1,
    // 每页展示的数据条数
    pagesize: 2,
    // 筛选的条件：文章的分类，如果值为空字符串，表示没有指定分类的筛选条件
    cate_id: '',
    // 筛选的条件：文章的发布状态，如果值为空字符串，表示没有发布状态对应的筛选条件
    state: ''
  }

  // 封装获取文章列表数据的函数
  function initArtList() {
    axios.get('/my/article/list', {
      params: q
    }).then(({ data: res }) => {
      if (res.code === 0) {
        // TODO：渲染表格中的数据
        const rows = []
        res.data.forEach(item => {
          rows.push(`<tr>
          <td><a href="javascript:;" style="color: blue;" class="show-detail" data-id="${item.id}">${item.title}</a></td>
          <td>${item.cate_name}</td>
          <td>${dayjs(item.pub_date).format('YYYY-MM-DD HH:mm:ss')}</td>
          <td>${item.state}</td>
          <td>
            <button type="button" class="layui-btn layui-btn-danger layui-btn-xs btn-delete" data-id="${item.id}">删除</button>
          </td>
        </tr>`)
        })
        $('tbody').html(rows)

        // 调用 renderPage 函数，渲染分页效果
        renderPage(res.total)
      }
    })
  }

  initArtList()

  // 封装获取文章分类的函数
  function initCateList() {
    axios.get('/my/cate/list').then(({ data: res }) => {
      if (res.code === 0) {
        const rows = []
        res.data.forEach(item => {
          rows.push(`<option value="${item.id}">${item.cate_name}</option>`)
        })
        $('[name="cate_id"]').append(rows)
        layui.form.render('select')
      }
    })
  }

  initCateList()

  // 为筛选区域的表单绑定 submit 事件
  $('form').on('submit', function (e) {
    e.preventDefault()

    // 要根据用户指定的筛选条件，重新请求第 1 页的数据
    // 1. 把用户勾选的分类的 id，存储到 q.cate_id 中
    // 2. 把用户勾选的发布状态，存储到 q.state 中
    // 3. 把页码值重置为 1
    q.cate_id = $('[name="cate_id"]').val()
    q.state = $('[name="state"]').val()
    q.pagenum = 1

    initArtList()
  })

  // 为“重置按钮”绑定点击事件
  $('[type="reset"]').on('click', function () {
    // 重置关键的查询参数项
    q.pagenum = 1
    q.cate_id = ''
    q.state = ''

    // 重新发起请求
    initArtList()
  })

  // 渲染分页效果
  function renderPage(total) {
    layui.laypage.render({
      elem: 'page-box', //注意，这里的 page-box 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize, // 每页展示多少条数据
      curr: q.pagenum, // 指定哪个页码值需要被高亮
      // 自定义分页的布局
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      // 自定义可以选择的条目数
      limits: [2, 5, 10, 15],
      jump: function (obj, first) {
        //obj包含了当前分页的所有参数，比如：
        // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
        // console.log(obj.limit); //得到每页显示的条数

        q.pagenum = obj.curr
        q.pagesize = obj.limit

        //首次不执行
        if (!first) {
          //do something
          initArtList()
        }
      }
    })
  }

  // 为删除按钮绑定 click 事件
  $('tbody').on('click', '.btn-delete', function () {
    const id = $(this).attr('data-id')

    // 询问用户是否删除
    layer.confirm('确认删除文章吗?', { icon: 3, title: '提示' }, function (index) {
      //do something
      axios.delete('/my/article/info', {
        params: { id }
      }).then(({ data: res }) => {
        if (res.code === 0) {
          // 1. 提示用户删除成功
          layer.msg('删除数据成功！')

          // 优化删除的功能，防止出现空白页面的情况
          if (q.pagenum > 1 && $('tbody tr').length === 1) {
            q.pagenum--
          }

          // 2. 刷新列表数据
          initArtList()
        }
      })

      layer.close(index);
    })
  })

  // 为标题的 a 链接绑定 click 事件
  $('tbody').on('click', '.show-detail', function () {
    const id = $(this).attr('data-id')

    // 1. 请求文章的详情数据
    // 2. 弹层展示文章的详情
    axios.get('/my/article/info', {
      params: { id }
    }).then(({ data: res }) => {
      if (res.code === 0) {
        // 数据获取成功！
        console.log(res)
        // 弹层展示文章的详情
        layer.open({
          type: 1,
          area: ['85%', '85%'],
          title: '预览文章',
          content: `<div class="artinfo-box">
          <h1 class="artinfo-title">${res.data.title}</h1>
          <div class="artinfo-bar">
            <span>作者：${res.data.nickname || res.data.username}</span>
            <span>发布时间：${dayjs(res.data.pub_date).format('YYYY-MM-DD HH:mm:ss')}</span>
            <span>所属分类：${res.data.cate_name}</span>
            <span>状态：${res.data.state}</span>
          </div>
          <hr>
          <img src="http://www.liulongbin.top:3008${res.data.cover_img}" alt="" class="artinfo-cover">
          <div>${res.data.content}</div>
          </div>`
        });
      }
    })
  })
})