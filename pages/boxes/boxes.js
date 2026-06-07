Page({
  data: {
    categories: ['全部', '特摄英雄', '萌系谷子', '国创卡牌', '限定福袋'],
    activeCategory: '全部',
    boxes: [
      {
        id: 'box-ultra-001',
        title: '银河英雄闪耀赏',
        category: '特摄英雄',
        price: 19.9,
        stockText: '剩余 23 / 80',
        tags: ['A赏剩 1', 'LAST 未出', '十连返券'],
        prizes: ['A 黑金终焉卡砖', 'B 烫金收藏卡', 'C 角色立牌'],
        color: '#ffcc4d',
        symbol: '银'
      },
      {
        id: 'box-dream-001',
        title: '甜梦乐园收藏赏',
        category: '萌系谷子',
        price: 16.9,
        stockText: '剩余 41 / 100',
        tags: ['LAST 未出', '可回收', '新手推荐'],
        prizes: ['A 毛绒挂件', 'B 亚克力立牌', 'C 闪卡'],
        color: '#ff8fb3',
        symbol: '甜'
      },
      {
        id: 'box-guochuang-001',
        title: '山海异兽秘纹赏',
        category: '国创卡牌',
        price: 12.9,
        stockText: '剩余 66 / 120',
        tags: ['低门槛', '集卡奖励', '包箱优惠'],
        prizes: ['A 金属徽章', 'B 透卡', 'C 普卡'],
        color: '#74d7b8',
        symbol: '山'
      }
    ]
  },
  selectCategory(event) {
    this.setData({ activeCategory: event.currentTarget.dataset.category })
  },
  startDraw(event) {
    const title = event.currentTarget.dataset.title
    wx.showToast({ title: `${title} 即将接入抽卡`, icon: 'none' })
  }
})
