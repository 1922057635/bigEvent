$(function () {
    // 请求文章类别的数据，并且渲染到页面上
    function getArticleSort() {
        axios.get('/my/cate/list').then(({ data: res }) => {
            console.log(res);
            // 获取文章类别信息成功
            if (res.code == 0) {
                
                const rows = [];
                res.data.forEach(value => {
                    rows.push(`<option value="${value.id}">${value.cate_name}</option>`);
                })
                $('[name="cate_id"]').html(rows);
                // 有些第三方框架的元素是不需要被layui进行管理的，所以需要被layui忽略在外，能够保持他本身自己的特性
                // 这里的富文本编辑器上工具条的可选项比如标题的级别的实现是通过js+css实现的的，也就是当用户点击一个选项的时候js会自动去找对应的select变迁下面的option对应的值来进行后续的处理。但是这个select标签被layui给捕捉到了并且进行了美化操作，但是我没不想让这个selected被layui给处理，所以我们才将这个selected给忽略掉，不被layui给管理起来
                $('.ql-toolbar select').attr('lay-ignore', '');
                // 重新渲染因为动态生成的元素而造成渲染不成功的问题，所以需要重新渲染一次
                layui.form.render('select');
                // 将富文本编辑器里面的下拉菜单给隐藏掉
                // 因为这个下拉菜单本身就是给程序员去使用来判断用户的输入 的，所以如果不被layui进行美化就会很难看，但是这个selected是不被用户知晓的，所以应给隐藏起来
                $('.ql-toolbar select').hide();
            }
        })
    }
    // 初始化下拉菜单里面的数据
    getArticleSort();
    // 这个常量是富文本剪辑器的工具条配置选项
    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike','image'],        // toggled buttons
        ['blockquote', 'code-block'],//代码引用和写的文字为代码形式
      
        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
      
        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],
      
        ['clean']                                         // remove formatting button
      ];
      
    // 创建富文本编辑框的实例
    const quill = new Quill('#editor', {
        // 设置工具条的配置
        modules: {
            toolbar: toolbarOptions
          },
        theme: 'snow'
    });

    $('.btn-choose-img').on('click', function () {
        $('#file').click();
    })
    // 定义一个标志变量来判断用户是否选择了封面的图片
    let coverFile = null;
    $('#file').on('change', function () {
        // 如果用户没有选择文件，就直接返回什么也不处理,并将封面图片标志设置为null
        if (this.files.length == 0) return file = null;
        let file = this.files[0];
        coverFile = file;
        console.log(file);
        let url = URL.createObjectURL(file);
        $('#image').prop('src', url);
    })
    $('.form-pub').on('submit', function (e) {
        e.preventDefault();
        // 在提交表单之前判断用户是否选择了封面
        if (!coverFile) {
            layer.msg('请设置封面之后在上传！');
            return 
        }
        console.log(e.originalEvent.submitter);
        let fw = new FormData();
        fw.append('title', $('input[name="title"]').val());
        fw.append('cate_id', $('[name="cate_id"]').val())
        // 这个地方也可以使用$('quill.root').html()获取。$('quill.root')获取的内容就是ql-editor
        fw.append('content', $('.ql-editor').html());
        // 这里也可以事先定义一个全局变量保存发布的状态，当点击发布和存为草稿的按钮的时候修改这个变量的值为对应的状态值
        fw.append('state', $(e.originalEvent.submitter).attr('data-state'));
        fw.append('cover_img', $('#file')[0].files[0]);
        console.log(fw)
        for ([key, value] of fw.entries()) {
            console.log(key, value);
        }
        // console.log($(this).serialize());
        axios.post('/my/article/add', fw).then(({ data: res }) => {
            // console.log(res);
            if (res.code == 0) {
                layer.msg(res.message);
                location.href = "/article/article.html";
                // 当跳转到文章列表的页面之后，将对应的文章列表导航栏区域设置为高亮，调用父窗口中的函数设置高亮
                window.parent.setHeight('文章列表');
            }
        })
    })
})