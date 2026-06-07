Page({
  data: {
    summary: [
      { label: '寄存中', value: 8 },
      { label: '可发货', value: 5 },
      { label: '可回收', value: 6 }
    ],
    items: [
      { id: 'wh-1', level: 'A', name: '黑金终焉卡砖', status: '寄存中', recycle: 120, source: '银河英雄闪耀赏' },
      { id: 'wh-2', level: 'B', name: '烫金收藏卡', status: '可发货', recycle: 40, source: '银河英雄闪耀赏' },
      { id: 'wh-3', level: 'C', name: '角色立牌', status: '可回收', recycle: 18, source: '甜梦乐园收藏赏' }
    ]
  },
  shipTogether() {
    wx.showToast({ title: '合并发货流程待接入', icon: 'none' })
  }
})
