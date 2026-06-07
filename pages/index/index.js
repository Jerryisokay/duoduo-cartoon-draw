Page({
  data: {
    marquee: [
      '露娜刚刚抽中 A赏 银河限定卡',
      '阿泽完成三丽鸥甜梦套卡',
      'Mika 带走 LAST赏 黑金立牌'
    ],
    featuredBoxes: [
      {
        id: 'box-ultra-001',
        title: '银河英雄闪耀赏',
        ip: '特摄英雄',
        price: 19.9,
        remaining: 23,
        total: 80,
        lastPrize: '黑金终焉卡砖',
        accent: '#ffcc4d'
      },
      {
        id: 'box-dream-001',
        title: '甜梦乐园收藏赏',
        ip: '萌系谷子',
        price: 16.9,
        remaining: 41,
        total: 100,
        lastPrize: '星糖限定挂件',
        accent: '#ff8fb3'
      }
    ],
    missions: [
      { label: '首抽礼', value: '新人 1 抽 9.9' },
      { label: '集卡', value: '完成套卡返券' },
      { label: '仓库', value: '满 3 件合并发货' }
    ]
  },
  goBoxes() {
    wx.switchTab({ url: '/pages/boxes/boxes' })
  }
})
