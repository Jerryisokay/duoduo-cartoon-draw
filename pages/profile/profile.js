Page({
  data: {
    user: {
      nickname: '赏盒玩家',
      level: 'Lv.3 收藏家',
      balance: 268,
      coupons: 4
    },
    menus: [
      '抽卡记录',
      '充值与消费',
      '收货地址',
      '实名认证',
      '概率公示',
      '客服与售后'
    ]
  },
  onMenuTap(event) {
    wx.showToast({ title: `${event.currentTarget.dataset.name} 待接入`, icon: 'none' })
  }
})
