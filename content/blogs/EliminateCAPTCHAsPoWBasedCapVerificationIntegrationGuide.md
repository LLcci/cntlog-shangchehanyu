---
title: 干掉图形验证码！基于PoW的Cap验证码集成指南
image: /cap0.jpg
date: 2025-06-13
description: 基于PoW的Cap验证码集成指南，替代传统图形验证码方案。
keywords: Cap验证码,PoW验证码,工作量证明,验证码替代,图形验证码,Nestjs集成,Vue3集成,人机验证,前端安全,后端验证
---

## Cap 是什么

> A modern, lightning-quick PoW captcha
>
> 一种现代的、闪电般快速的工作量证明验证码
>
> Cap is a lightweight, modern open-source CAPTCHA alternative using proof-of-work
>
> Cap 是一款轻量级、现代化的开源验证码替代方案，采用工作量证明机制。

与传统验证码不同，Cap：

- 速度快且不干扰用户
- 不使用跟踪技术或 cookie
- 使用工作量证明而非干扰性谜题
- 完全可访问且可自行托管

Cap 主要由小部件（可以以不可见的方式使用）和服务器（你也可以使用独立服务器）组成。另外，它还支持机器对机器通信，并且有一个类似于 Cloudflare 的检查点中间件。

文档地址：[https://capjs.js.org/](https://capjs.js.org/)

github：[https://github.com/tiagorangel1/cap](https://github.com/tiagorangel1/cap)

## 客户端

以在 Vue3 + ElementPlus 中使用为例

在 index.html 引入 Cap widget：

> 生产环境请引入固定版本

```javascript
<script src="https://cdn.jsdelivr.net/npm/@cap.js/widget"></script>
```

在 ElForm 中使用组件：

```html
<el-form-item prop="code">
  <cap-widget
    id="cap"
    :data-cap-api-endpoint="capApi"
    data-cap-i18n-verifying-label="验证中..."
    data-cap-i18n-initial-state="点击验证"
    data-cap-i18n-solved-label="验证通过"
    data-cap-i18n-error-label="验证失败，请重试"
  ></cap-widget>
</el-form-item>
```

其中`data-cap-api-endpoint`为服务端验证 URL 我这里设置为：

```typescript
const capApi = ref(`${import.meta.env.VITE_API_URL}/admin/sys/login/`);
```

`data-cap-i18n`开头的几个选项为国际化设置。

设置表单，以及校验规则：

```typescript
import { type FormInstance, type FormRules } from "element-plus";

const formRef = ref<FormInstance>();

let formData = reactive<
  paths["/admin/sys/login"]["post"]["requestBody"]["content"]["application/json"]
>({
  username: "",
  password: "",
  code: "",
});

const rules = reactive<FormRules<typeof formData>>({
  username: [{ required: true, message: "请输入用户名" }],
  password: [{ required: true, message: "请输入密码" }],
  code: [{ required: true, message: "请点击验证" }],
});
```

监听 Cap 校验结果：

```typescript
onMounted(() => {
  const widget = document.querySelector("#cap");

  widget?.addEventListener("solve", function (e: any) {
    formData.code = e.detail.token;
  });
});
```

表单校验及提交不在赘述

<img src="/cap1.jpg" style="max-width: 800px;height: auto;" />

## 服务端

以在 Nestjs 中使用为例

安装 @cap.js/server

```cmd
npm i @cap.js/server
```

在 Service 中创建 Cap 实例：

```typescript
import Cap from "@cap.js/server";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class LoginService {
  // ...
  cap: Cap = new Cap({ tokens_store_path: ".data/tokensList.json" });
  //...
}
```

> Cap 默认使用内存和文件存储 token，你可以将`noFSState`设置为`true`，仅使用内存存储 token。
>
> 你可以将此与设置`config.state`结合使用，以使用诸如`Redis`之类来存储令牌。
>
> 可以参考这个 [Pull requests](https://github.com/tiagorangel1/cap/pull/16)。

在 Controller 中创建接口：

```typescript
import { BadRequestException, Body, Controller, Post } from "@nestjs/common";
import { LoginService } from "./login.service";

@Controller("login")
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post("/challenge")
  async challenge() {
    return this.loginService.cap.createChallenge();
  }

  @Post("/redeem")
  async redeem(
    @Body() body: { token: string; solutions: Array<[string, string, string]> }
  ) {
    const { token, solutions } = body;
    if (!token || !solutions) {
      return new BadRequestException("人机验证失败");
    }
    return this.loginService.cap.redeemChallenge({ token, solutions });
  }
}
```

当用户点击客户端 Cap 组件时，将请求`/challenge`和`/redeem`获取 token。

<img src="/cap2.jpg" style="max-width: 800px;height: auto;" />

<img src="/cap3.jpg" style="max-width: 800px;height: auto;" />

最后在登录接口的 Service 内添加 token 验证：

```typescript
// ...
const result = await this.cap.validateToken(loginDto.code);
if (!result.success) {
  throw new BadRequestException("人机验证失败");
}
// ...
```

## 结束啦

如果你想看这篇文章内的详细代码，可以查看 foolon admin 的登录功能：

github：[https://github.com/LLcci/foolon-admin-monorepo](https://github.com/LLcci/foolon-admin-monorepo)

gitee：[https://gitee.com/shangchehanyu_admin/foolon-admin-monorepo](https://gitee.com/shangchehanyu_admin/foolon-admin-monorepo)

如果你有任何想法，欢迎在评论区交流呀~
