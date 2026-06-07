# 一番赏抽卡 MongoDB 核心模型草案

## users

```js
{
  _id: ObjectId,
  openid: String,
  unionid: String,
  nickname: String,
  avatarUrl: String,
  phone: String,
  realNameStatus: 'unverified' | 'pending' | 'verified' | 'rejected',
  ageGroup: 'unknown' | 'minor' | 'adult',
  balance: Number,
  couponCount: Number,
  status: 'active' | 'limited' | 'blocked',
  dailySpendLimit: Number,
  createdAt: Date,
  updatedAt: Date
}
```

推荐索引：`openid unique`、`unionid`、`phone`。

## ip_series

```js
{
  _id: ObjectId,
  name: String,
  code: String,
  coverUrl: String,
  category: '特摄英雄' | '萌系谷子' | '国创卡牌' | '限定福袋',
  description: String,
  status: 'draft' | 'online' | 'offline',
  sort: Number,
  createdAt: Date,
  updatedAt: Date
}
```

推荐索引：`code unique`、`status + sort`。

## prize_boxes

```js
{
  _id: ObjectId,
  ipSeriesId: ObjectId,
  title: String,
  code: String,
  coverUrl: String,
  drawPrice: Number,
  drawModes: [
    { type: 'single', count: 1, price: Number },
    { type: 'ten', count: 10, price: Number }
  ],
  totalCount: Number,
  remainingCount: Number,
  lastPrizeId: ObjectId,
  probabilityText: String,
  status: 'draft' | 'selling' | 'sold_out' | 'offline',
  saleStartAt: Date,
  saleEndAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

推荐索引：`code unique`、`status + saleStartAt`、`ipSeriesId`。

## prizes

```js
{
  _id: ObjectId,
  boxId: ObjectId,
  name: String,
  level: 'LAST' | 'A' | 'B' | 'C' | 'D' | 'E',
  imageUrl: String,
  totalQuantity: Number,
  remainingQuantity: Number,
  recycleValue: Number,
  isPhysical: Boolean,
  sort: Number,
  createdAt: Date,
  updatedAt: Date
}
```

推荐索引：`boxId + level`、`boxId + remainingQuantity`。

## draw_orders

```js
{
  _id: ObjectId,
  orderNo: String,
  userId: ObjectId,
  boxId: ObjectId,
  drawCount: Number,
  unitPrice: Number,
  totalAmount: Number,
  payType: 'balance' | 'wechat_pay' | 'coupon',
  payStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  drawStatus: 'pending' | 'completed' | 'failed',
  createdAt: Date,
  paidAt: Date,
  completedAt: Date
}
```

推荐索引：`orderNo unique`、`userId + createdAt`、`boxId + createdAt`。

## draw_logs

```js
{
  _id: ObjectId,
  orderId: ObjectId,
  userId: ObjectId,
  boxId: ObjectId,
  prizeId: ObjectId,
  level: String,
  drawIndex: Number,
  randomSeedHash: String,
  remainingSnapshot: [
    { prizeId: ObjectId, level: String, remainingQuantity: Number }
  ],
  clientIp: String,
  deviceId: String,
  createdAt: Date
}
```

推荐索引：`userId + createdAt`、`boxId + createdAt`、`orderId`。

## warehouse_items

```js
{
  _id: ObjectId,
  userId: ObjectId,
  prizeId: ObjectId,
  boxId: ObjectId,
  drawLogId: ObjectId,
  name: String,
  level: String,
  imageUrl: String,
  recycleValue: Number,
  status: 'stored' | 'shipping_requested' | 'shipped' | 'recycled' | 'gifted' | 'locked',
  shipOrderId: ObjectId,
  recycledAt: Date,
  giftedToUserId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

推荐索引：`userId + status`、`drawLogId unique`、`shipOrderId`。

## shipping_orders

```js
{
  _id: ObjectId,
  shipNo: String,
  userId: ObjectId,
  warehouseItemIds: [ObjectId],
  addressId: ObjectId,
  freightAmount: Number,
  status: 'pending' | 'paid' | 'packed' | 'shipped' | 'received' | 'cancelled',
  expressCompany: String,
  expressNo: String,
  createdAt: Date,
  shippedAt: Date,
  receivedAt: Date
}
```

推荐索引：`shipNo unique`、`userId + createdAt`、`status + createdAt`。

## addresses

```js
{
  _id: ObjectId,
  userId: ObjectId,
  receiverName: String,
  phone: String,
  province: String,
  city: String,
  district: String,
  detail: String,
  isDefault: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

推荐索引：`userId + isDefault`。

## card_albums

```js
{
  _id: ObjectId,
  boxId: ObjectId,
  name: String,
  totalCards: Number,
  rewardType: 'coupon' | 'coin' | 'badge' | 'recycle_bonus',
  rewardValue: Number,
  status: 'draft' | 'online' | 'offline',
  createdAt: Date,
  updatedAt: Date
}
```

推荐索引：`boxId unique`、`status`。

## user_card_progress

```js
{
  _id: ObjectId,
  userId: ObjectId,
  albumId: ObjectId,
  collectedPrizeIds: [ObjectId],
  collectedCount: Number,
  totalCount: Number,
  rewardStatus: 'unavailable' | 'available' | 'claimed',
  claimedAt: Date,
  updatedAt: Date
}
```

推荐索引：`userId + albumId unique`、`userId + rewardStatus`。

## balance_records

```js
{
  _id: ObjectId,
  userId: ObjectId,
  type: 'recharge' | 'draw' | 'recycle' | 'refund' | 'reward',
  amount: Number,
  beforeBalance: Number,
  afterBalance: Number,
  relatedType: 'draw_order' | 'warehouse_item' | 'shipping_order' | 'system_reward',
  relatedId: ObjectId,
  createdAt: Date
}
```

推荐索引：`userId + createdAt`、`relatedType + relatedId`。

## 抽卡事务建议

1. 创建或确认支付成功的 `draw_orders`。
2. 在 MongoDB transaction 中读取 `prize_boxes` 和对应 `prizes`。
3. 基于所有 `remainingQuantity > 0` 的奖品展开剩余奖池，执行不放回随机抽取。
4. 扣减 `prize_boxes.remainingCount` 与 `prizes.remainingQuantity`。
5. 写入 `draw_logs`。
6. 为每条中奖结果创建 `warehouse_items`。
7. 如用余额支付，同事务写 `balance_records` 并扣减 `users.balance`。

## MVP 最小集合

首版可以只实现：`users`、`ip_series`、`prize_boxes`、`prizes`、`draw_orders`、`draw_logs`、`warehouse_items`、`addresses`、`shipping_orders`。

卡册、社区、转赠、回收增强可以二期接入。
