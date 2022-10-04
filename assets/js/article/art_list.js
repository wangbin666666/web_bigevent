$(function(){
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage


  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  var q = {
    pagenum : 1 ,
    pagesize : 2,
    cate_id :'',
    state : ''
  }

  initTable()

  initCate()

  // 获取文章数据的方法
  function initTable(){
    $.ajax({
      method : 'GET',
      url : '/my/article/list',
      data : q,
      success : function(res){
          // console.log(res)
          if ( res.status !== 0 ) {
            return layer.msg('获取文章列表失败！')
          }
          // 使用模板引擎渲染列表数据
         var htmlStr =  template('tpl-table',res)
         $('tbody').html(htmlStr)
      }
    })
  }


  // 初始化文章分类的方法
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function(res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败！')
        }
        // 调用模板引擎渲染分类的可选项
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通过 layui 重新渲染表单区域的UI结构
        form.render()
      }
    })
  }


  // 为筛选表单绑定 submit 事件
  $('#form-search').on('submit', function(e) {
    e.preventDefault()
    // 获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    // 根据最新的筛选条件，重新渲染表格的数据
    initTable()
  })


  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用 laypage.render()方法来渲染分页的结构
    laypage.render({
      elem:'pageBox',
      count : total, 
      limit : q.pagesize,
      curr : q.pagenum,
      layout : ['count','limit','prev','page','next','skip'],
      limits : [2,3,5,10],
      jump : function(obj,first){
        console.log(first)
        console.log(obj.curr)
        q.pagenum = obj.curr
        q.padZero = obj.limit
        if(!first){
          initTable()
        }
      }
    })
  }


  // 通过代理的形式，为删除按钮绑定点击事件处理函数
  $('tbody').on('click','.btn-delete',function(){
      var len = $('.btn-delete').length
      console.log(len)

      // 获取文章的id
      var id = $(this).attr('data-id')
      // 询问用户是否要删除数据
      layer.confirm('确认删除？',{icon: 3 ,title : '提示'},function(index){
          $.ajax({
            method : 'GET',
            url : '/my/article/delete/'+id,
            success : function(res){
              if ( res.status !== 0){
                return layer.msg('删除文章失败！')
              }
              layer.msg('删除文章成功！')
              if( len === 1){
                q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
              }
              initTable()
            }
          })
          layer.close(index)
      })
  })

  // 通过代理的形式，为编辑按钮绑定点击事件处理函数
  $('tbody').on('click','.btn-edit',function(){
    var id = $(this).attr('data-id')
    // location.href = '/article/art_pub.html'
    $.ajax({
      method : 'GET',
      url : '/my/article/'+id,
      success : function(res){
        console.log(res)
      }
    })
     
  })
})