$(function () {

  // 调用获取用户基本信息
  getUserInfo()
   
  // 点击按钮 ，实现退出功能

  var layer = layui.layer
  $('#btnLogout').on('click', function () {
    layer.confirm('确定退出登入?', { icon: 3, title: '提示' }, function (index) {
        // 1.清空本地存储中的token
        localStorage.removeItem('token')
        // 2.重新跳转到登入页面
        location.href = '/login.html'

        // 关闭confirm 询问框  
        layer.close(index)
    })
  })
})

function getUserInfo() {

  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    // headers: {
    //   Authorization: localStorage.getItem('token') || ''

    // },
    success: function (res) {
      // console.log(res)
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败！')
      }
      // 调用renderAvatar 渲染用户的头像
      renderAvatar(res.data)
    },
    // 不论成功还是失败，最终都会调用 complete 回调函数
    // complete : function(res){
    //       // console.log('执行了 complete 回调函数');
    //       console.log(res)
    //       // 在 complete 回调函数中，可以使用 res.responseJSON 服务器响应回来的数据
    //       if( res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
    //           // 1.强制清空 token
    //           localStorage.removeItem('token')

    //           // 2. 强制调到登入页
    //           location.href = '/login.html'
    //       }
    // }

  })
}

function renderAvatar(user) {
  // 1. 获取用户的名称
  var name = user.nickname || user.username
  // 2. 设置欢迎的文本
  $('#wellcome').html('欢迎&nbsp;&nbsp;' + name)
  // 3. 按需渲染图片的头像
  if (user.user_pic !== null) {
    // 3.1 渲染图片头像
    $('.layui-nav-img')
      .attr('src', user.user_pic)
      .show()
    $('.text-avatar').hide()
  } else {
    // 3.2 渲染文本头像
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar')
      .html(first)
      .show()
  }
}