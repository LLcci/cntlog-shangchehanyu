---
title: 🏹从射箭开始的全栈开发之路🏹
image: /arrow_shadow.jpg
date: 2025-03-06
description: 使用Nestjs+Vue3技术栈开发"箭影日志"小程序的心路历程，包含功能的实现过程和技术选型思考。
keywords: 射箭,全栈开发,Nestjs,Vue3,箭影日志,产品开发,技术选型,小程序开发,个人项目,开发心得
---

> 火龙果跟我说：产品的灵感来自于生活，生活越丰富，灵感越多

## 射箭伊始

`爱好从偶然开始`，去年火龙果跟我说看到一个射箭课程，想去试试，于是我们便去试了。

从此一发不可收拾。竞技反曲弓、传统弓、复合弓、美猎弓，最终我们选择了竞技反曲弓，并打算 30 米打到 600 环后就去参加比赛。

现在每周要去射箭两次，工作日下班以后也会在家做力量训练。思想上也有很大的改变，放松了很多，火龙果说我人都变柔和了。😂😂

现在想想，从小玩游戏就喜欢用弓箭手，fate 里最喜欢的职阶也是 Archer，怪猎也喜欢玩弓（~~就是菜~~）。

## 为什么要做全栈开发

其实也没有什么特别的原因，在工作过程中自然而然的（~~就是被逼的~~）。

从事前端开发 7 年多，做过**web**、**小程序**、**APP**，桌面端也用**Electron**写过一点。后端开发用**nodejs**、**java**也有 5 年多。也曾一时兴起用**Nestjs**、**Vue3**写了一个权限管理系统的框架[**`foolon admin`**](https://llcci.github.io/foolon-admin-monorepo/)。文档地址：[https://llcci.github.io/foolon-admin-monorepo/](https://llcci.github.io/foolon-admin-monorepo/)。

一直也想做一个自己的产品，但是却没有灵感，不知道要做什么。

> 射箭给了我一个产品的灵感。

## 灵感是什么

正题要开始啦~~ 咳咳

我们在射箭训练的时候，需要按照一定的时间间隔去射出固定数量的箭，比如 10 秒准备-180 秒射箭-180 秒拔箭+记录环值，如此循环 12 组。

完成一整次的训练流程后，需要记录训练的内容，并写下自己在这次训练中的感悟。

按照这种思路，总结出来以下功能：

1. 计时器，用于开启射箭循环并计时。
2. 记环值，用于记录射箭的环值。
3. 记录箭孔，用于记录箭孔的分布。
4. 记笔记，用于记录训练的感悟。
5. 训练汇总，训练数据的汇总显示。
6. 训练统计，训练数据的统计分析，用各种图表显示。

其中记环值、写笔记、训练汇总，所有用户都可以使用，其他的需要支付开通会员后使用。

~~到现在为止也没有人支付开通会员 😭😭~~

后面接入了广告，看 3 次视频激励广告，就可以获得 1 天会员。

希望能够服务器的成本就好。

## 为什么不使用现成的射箭工具

> 因为没有聚合这 3 种功能的射箭工具 😑😑

单独的计时器有很多，记环值的工具虽然不多但是也有，记笔记的可以用各种写日记的工具替代。

但是！！！同时拥有这三种功能的工具没有。（~~没错，我做的就是个缝合怪~~）

## 那就开始搞吧

### 技术选型

后端：Nestjs、mysql、redis

前端：Vue3、Vite、typescript

### 框架选择

后端以及管理系统前端，就使用我自己写的权限管理系统的框架[**`foolon admin`**](https://llcci.github.io/foolon-admin-monorepo/)。文档地址：[https://llcci.github.io/foolon-admin-monorepo/](https://llcci.github.io/foolon-admin-monorepo/)。[GitHub](https://github.com/LLcci/foolon-admin-monorepo) [Gitee](https://gitee.com/shangchehanyu_admin/foolon-admin-monorepo) 欢迎大家 Star、提 Issues。

用户端使用的是[菲鸽大佬](https://juejin.cn/user/3263006241460792/posts)开发的[unibest](https://codercup.github.io/unibest-docs/)。[🔥2024 年最好用的 uniapp 开发模板 unibest，近一个月 star 数飙升！🔥](https://juejin.cn/post/7329034439408615451)

## 成品展示

<img src="/arrow_shadow.jpg" alt="arrow_shadow" style="max-width: 800px; height: auto;" />

## 到最后啦

后续的话，这个产品也会持续运营，如果有爱好射箭的 jym 一定要试试呀。

在微信里搜索`箭影日志`就可以找到啦。

如果有什么想要的功能，一定要告诉我呀，私信、评论都可以，小程序里的客服牛马也是我。

技术方面的话，从这篇文章开始，以后一定会持续写的。（~~flag 先立下了~~）

掰掰啦~~
