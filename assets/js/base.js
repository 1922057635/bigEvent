axios.defaults.baseURL = 'http://www.liulongbin.top:3008';
// 添加请求拦截器
// 对于那些有访问权限的接口需要添加特定的请求头部，这个是请求头部可以放置到这个请求拦截器里面，这样以后我们在请求这样类似有访问权限的接口时候就不用再配置请求头了
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    console.log(config);
    // 只要是访问有权限的接口都是以/my开头的字符串，只要检测字符串是以这样的开头的就需要添加Authorization这个头部信息
    if (config.url.indexOf('/my') != -1) {
        config.headers.Authorization = localStorage.getItem('token');
   }
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });
