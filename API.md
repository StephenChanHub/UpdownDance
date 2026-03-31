# UpDown 后端接口文档

> 版本：1.0.0 · 数据库：MongoDB · 运行端口：`3000`

---

## 全局约定

### Base URL

```
https://urtumnpimfvy.sealosgzg.site/
```

### 鉴权

需要登录的接口，在请求 Header 中携带：

```
Authorization: Bearer <accessToken>
```

`accessToken` 由注册 / 登录接口返回，有效期 **7 天**。

### 统一响应结构

**成功**

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

**失败**

```json
{
  "code": 4001,
  "message": "Invalid credentials",
  "data": null
}
```

### 错误码速查

| code   | 含义                   |
| ------ | ---------------------- |
| `0`    | 成功                   |
| `4000` | 参数错误               |
| `4001` | 账号或密码错误         |
| `4003` | 未授权 / Token 失效    |
| `4040` | 资源不存在             |
| `4090` | 资源冲突（账号已存在） |
| `5000` | 服务异常               |

---

## 数据模型

### User

```json
{
  "id": "u_1abc23",
  "nickname": "Stephen",
  "account": "stephen_01",
  "avatar": "local://media/m_abc",
  "bio": "hello updown",
  "phone": "+86 13800138000",
  "email": "a@b.com",
  "following": 0,
  "followers": 0,
  "likes": 0,
  "createdAt": "2026-03-31T08:00:00.000Z",
  "updatedAt": "2026-03-31T09:00:00.000Z"
}
```

### Post

```json
{
  "id": "p_1abc23",
  "authorId": "u_1abc23",
  "username": "Stephen",
  "image": "local://media/m_abc",
  "images": ["local://media/m_abc", "local://media/m_def"],
  "ratio": "9:16",
  "title": "my post",
  "content": "content text",
  "createdAt": "2026-03-31T08:30:00.000Z",
  "updatedAt": "2026-03-31T08:30:00.000Z"
}
```

---

## 一、健康检查

### `GET /health`

无需鉴权，用于确认服务是否正常运行。

**成功响应** `200`

```json
{
  "code": 0,
  "message": "ok",
  "data": { "status": "ok" }
}
```

---

## 二、账号接口

### 2.1 注册

**`POST /auth/register`**

**Request Body**

```json
{
  "nickname": "Stephen",
  "account": "stephen_01",
  "password": "123456",
  "phone": "+86 13800138000",
  "email": "a@b.com",
  "avatar": "local://media/m_abc"
}
```

| 字段     | 类型   | 必填 | 说明                       |
| -------- | ------ | ---- | -------------------------- |
| nickname | string | ✅   | 昵称                       |
| account  | string | ✅   | 登录账号，全局唯一         |
| password | string | ✅   | 明文密码，后端 bcrypt 存储 |
| phone    | string | —    | 手机号                     |
| email    | string | —    | 邮箱                       |
| avatar   | string | —    | 头像媒体索引               |

**成功响应** `200`

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "accessToken": "eyJhbGci...",
    "user": {
      "id": "u_1abc23",
      "nickname": "Stephen",
      "account": "stephen_01",
      "avatar": "local://media/m_abc",
      "bio": "",
      "phone": "+86 13800138000",
      "email": "a@b.com",
      "following": 0,
      "followers": 0,
      "likes": 0,
      "createdAt": "2026-03-31T08:00:00.000Z",
      "updatedAt": "2026-03-31T08:00:00.000Z"
    }
  }
}
```

**失败响应**

| 场景         | HTTP | code | message                                     |
| ------------ | ---- | ---- | ------------------------------------------- |
| 缺少必填字段 | 400  | 4000 | nickname, account and password are required |
| 账号已存在   | 409  | 4090 | Account already exists                      |
| 服务异常     | 500  | 5000 | Service error                               |

---

### 2.2 登录

**`POST /auth/login`**

**Request Body**

```json
{
  "account": "stephen_01",
  "password": "123456"
}
```

> 也支持用 `nickname` 替代 `account` 登录：
>
> ```json
> { "nickname": "Stephen", "password": "123456" }
> ```

| 字段     | 类型   | 必填         | 说明     |
| -------- | ------ | ------------ | -------- |
| account  | string | ✅（二选一） | 登录账号 |
| nickname | string | ✅（二选一） | 昵称     |
| password | string | ✅           | 密码     |

**成功响应** `200` — 结构同注册。

**失败响应**

| 场景           | HTTP | code | message                                        |
| -------------- | ---- | ---- | ---------------------------------------------- |
| 缺少必填字段   | 400  | 4000 | account or nickname, and password are required |
| 账号或密码错误 | 401  | 4001 | Invalid credentials                            |
| 服务异常       | 500  | 5000 | Service error                                  |

---

### 2.3 获取当前用户

**`GET /auth/me`** 🔒 需鉴权

**Request Headers**

```
Authorization: Bearer <accessToken>
```

**成功响应** `200`

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "user": {
      "id": "u_1abc23",
      "nickname": "Stephen",
      "account": "stephen_01",
      "avatar": "local://media/m_abc",
      "bio": "",
      "phone": "+86 13800138000",
      "email": "a@b.com",
      "following": 0,
      "followers": 0,
      "likes": 0,
      "createdAt": "2026-03-31T08:00:00.000Z",
      "updatedAt": "2026-03-31T08:00:00.000Z"
    }
  }
}
```

**失败响应**

| 场景         | HTTP | code | message                  |
| ------------ | ---- | ---- | ------------------------ |
| 未携带 Token | 401  | 4003 | Unauthorized             |
| Token 失效   | 401  | 4003 | Token expired or invalid |

---

### 2.4 登出

**`POST /auth/logout`** 🔒 需鉴权

MVP 阶段后端无状态，前端清除本地 Token 即可；本接口用于统一入口预留。

**成功响应** `200`

```json
{
  "code": 0,
  "message": "ok",
  "data": { "success": true }
}
```

---

## 三、用户资料接口

### 3.1 更新资料

**`PATCH /users/profile`** 🔒 需鉴权

所有字段均为可选，仅传需要修改的字段。

**Request Body**

```json
{
  "nickname": "Stephen New",
  "account": "stephen_02",
  "bio": "new bio",
  "phone": "+86 13900000000",
  "email": "new@b.com",
  "avatar": "local://media/m_xyz"
}
```

| 字段     | 类型   | 必填 | 说明             |
| -------- | ------ | ---- | ---------------- |
| nickname | string | —    | 新昵称           |
| account  | string | —    | 新账号，全局唯一 |
| bio      | string | —    | 个人简介         |
| phone    | string | —    | 手机号           |
| email    | string | —    | 邮箱             |
| avatar   | string | —    | 头像媒体索引     |

**成功响应** `200`

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "user": { "...用户完整字段..." }
  }
}
```

**失败响应**

| 场景                | HTTP | code | message                |
| ------------------- | ---- | ---- | ---------------------- |
| 未携带 Token        | 401  | 4003 | Unauthorized           |
| 新 account 已被占用 | 409  | 4090 | Account already exists |
| 服务异常            | 500  | 5000 | Service error          |

---

## 四、媒体索引接口

> 图片不上传到服务器，前端将本地路径登记为稳定索引后，Post 中只存索引字符串。

### 4.1 登记本地图片索引

**`POST /media/local-index`** 🔒 需鉴权

接口幂等：同一用户相同 `localPath + type` 多次调用，返回同一个 `mediaId`。

**Request Body**

```json
{
  "localPath": "wxfile://tmp_abc.jpg",
  "type": "image"
}
```

| 字段      | 类型   | 必填 | 说明                 |
| --------- | ------ | ---- | -------------------- |
| localPath | string | ✅   | 前端本地临时路径     |
| type      | string | ✅   | 媒体类型，如 `image` |

**成功响应** `200`

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "mediaId": "m_1abc23",
    "mediaRef": "local://media/m_1abc23",
    "localPath": "wxfile://tmp_abc.jpg",
    "type": "image"
  }
}
```

**失败响应**

| 场景         | HTTP | code | message                         |
| ------------ | ---- | ---- | ------------------------------- |
| 缺少必填字段 | 400  | 4000 | localPath and type are required |
| 未携带 Token | 401  | 4003 | Unauthorized                    |
| 服务异常     | 500  | 5000 | Service error                   |

---

### 4.2 查询媒体索引

**`GET /media/local-index/:mediaId`**

**Path Params**

| 参数    | 说明                   |
| ------- | ---------------------- |
| mediaId | 媒体 ID，如 `m_1abc23` |

**成功响应** `200`

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "mediaId": "m_1abc23",
    "mediaRef": "local://media/m_1abc23",
    "localPath": "wxfile://tmp_abc.jpg",
    "type": "image",
    "ownerId": "u_1abc23"
  }
}
```

**失败响应**

| 场景     | HTTP | code | message         |
| -------- | ---- | ---- | --------------- |
| 不存在   | 404  | 4040 | Media not found |
| 服务异常 | 500  | 5000 | Service error   |

---

## 五、Post 接口

### 5.1 创建 Post

**`POST /posts`** 🔒 需鉴权

**Request Body**

```json
{
  "image": "local://media/m_abc",
  "images": ["local://media/m_abc", "local://media/m_def"],
  "ratio": "9:16",
  "title": "my post",
  "content": "content text"
}
```

| 字段    | 类型     | 必填 | 说明                                                       |
| ------- | -------- | ---- | ---------------------------------------------------------- |
| title   | string   | ✅   | 标题                                                       |
| ratio   | string   | ✅   | 比例，枚举值：`9:16` `1:1` `16:9`                          |
| image   | string   | —    | 封面图（建议等于 `images[0]`），若不传则自动取 `images[0]` |
| images  | string[] | —    | 图片列表，最多 9 张，默认 `[]`                             |
| content | string   | —    | 正文                                                       |

**成功响应** `200`

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "post": {
      "id": "p_1abc23",
      "authorId": "u_1abc23",
      "username": "Stephen",
      "image": "local://media/m_abc",
      "images": ["local://media/m_abc", "local://media/m_def"],
      "ratio": "9:16",
      "title": "my post",
      "content": "content text",
      "createdAt": "2026-03-31T08:30:00.000Z",
      "updatedAt": "2026-03-31T08:30:00.000Z"
    }
  }
}
```

**失败响应**

| 场景                | HTTP | code | message                              |
| ------------------- | ---- | ---- | ------------------------------------ |
| 缺少 ratio 或 title | 400  | 4000 | ratio and title are required         |
| ratio 值非法        | 400  | 4000 | ratio must be one of 9:16, 1:1, 16:9 |
| images 非数组       | 400  | 4000 | images must be an array              |
| images 超过 9 张    | 400  | 4000 | images can contain at most 9 items   |
| 未携带 Token        | 401  | 4003 | Unauthorized                         |
| 服务异常            | 500  | 5000 | Service error                        |

---

### 5.2 Post 列表

**`GET /posts`**

**Query Params**

| 参数     | 类型   | 默认值 | 说明                                                      |
| -------- | ------ | ------ | --------------------------------------------------------- |
| page     | number | `1`    | 页码                                                      |
| pageSize | number | `20`   | 每页条数，最大 `100`                                      |
| keyword  | string | —      | 模糊搜索（匹配 username / title / content，不区分大小写） |
| authorId | string | —      | 按作者 ID 过滤                                            |

**成功响应** `200`

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [
      {
        "id": "p_1abc23",
        "authorId": "u_1abc23",
        "username": "Stephen",
        "image": "local://media/m_abc",
        "images": ["local://media/m_abc"],
        "ratio": "9:16",
        "title": "my post",
        "content": "content text",
        "createdAt": "2026-03-31T08:30:00.000Z",
        "updatedAt": "2026-03-31T08:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100
    }
  }
}
```

**失败响应**

| 场景     | HTTP | code | message       |
| -------- | ---- | ---- | ------------- |
| 服务异常 | 500  | 5000 | Service error |

---

### 5.3 Post 详情

**`GET /posts/:postId`**

**Path Params**

| 参数   | 说明                   |
| ------ | ---------------------- |
| postId | Post ID，如 `p_1abc23` |

**成功响应** `200`

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "post": { "...Post 完整字段..." }
  }
}
```

**失败响应**

| 场景        | HTTP | code | message        |
| ----------- | ---- | ---- | -------------- |
| Post 不存在 | 404  | 4040 | Post not found |
| 服务异常    | 500  | 5000 | Service error  |

---

### 5.4 更新 Post

**`PATCH /posts/:postId`** 🔒 需鉴权（仅作者本人）

所有字段均为可选，仅传需要修改的字段。

**Request Body**

```json
{
  "image": "local://media/m_abc",
  "images": ["local://media/m_abc", "local://media/m_xyz"],
  "ratio": "1:1",
  "title": "edited title",
  "content": "edited content"
}
```

| 字段    | 类型     | 说明                                                              |
| ------- | -------- | ----------------------------------------------------------------- |
| image   | string   | 封面图                                                            |
| images  | string[] | 图片列表，最多 9 张；若传 images 但不传 image，自动取 `images[0]` |
| ratio   | string   | `9:16` `1:1` `16:9`                                               |
| title   | string   | 标题                                                              |
| content | string   | 正文                                                              |

**成功响应** `200`

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "post": { "...更新后的 Post 完整字段..." }
  }
}
```

**失败响应**

| 场景             | HTTP | code | message                              |
| ---------------- | ---- | ---- | ------------------------------------ |
| Post 不存在      | 404  | 4040 | Post not found                       |
| 非作者操作       | 403  | 4003 | Unauthorized                         |
| ratio 值非法     | 400  | 4000 | ratio must be one of 9:16, 1:1, 16:9 |
| images 非数组    | 400  | 4000 | images must be an array              |
| images 超过 9 张 | 400  | 4000 | images can contain at most 9 items   |
| 未携带 Token     | 401  | 4003 | Unauthorized                         |
| 服务异常         | 500  | 5000 | Service error                        |

---

### 5.5 删除 Post

**`DELETE /posts/:postId`** 🔒 需鉴权（仅作者本人）

**Path Params**

| 参数   | 说明                   |
| ------ | ---------------------- |
| postId | Post ID，如 `p_1abc23` |

**成功响应** `200`

```json
{
  "code": 0,
  "message": "ok",
  "data": { "success": true }
}
```

**失败响应**

| 场景         | HTTP | code | message        |
| ------------ | ---- | ---- | -------------- |
| Post 不存在  | 404  | 4040 | Post not found |
| 非作者操作   | 403  | 4003 | Unauthorized   |
| 未携带 Token | 401  | 4003 | Unauthorized   |
| 服务异常     | 500  | 5000 | Service error  |

---

## 六、前端页面对接速查

| 页面           | 操作         | 接口                                        |
| -------------- | ------------ | ------------------------------------------- |
| Me.vue         | 注册         | `POST /auth/register`                       |
| Me.vue         | 登录         | `POST /auth/login`                          |
| Me.vue         | 获取当前用户 | `GET /auth/me`                              |
| Me.vue         | 编辑资料     | `PATCH /users/profile`                      |
| Me.vue         | 退出         | `POST /auth/logout`                         |
| Me.vue         | 我的帖子     | `GET /posts?authorId=<currentUserId>`       |
| Post.vue       | 选图登记索引 | `POST /media/local-index`（每张图各调一次） |
| Post.vue       | 新建帖子     | `POST /posts`                               |
| Post.vue       | 编辑帖子     | `PATCH /posts/:postId`                      |
| Explore.vue    | 帖子列表     | `GET /posts?page=1&pageSize=20`             |
| Explore.vue    | 搜索         | `GET /posts?keyword=xxx`                    |
| PostDetail.vue | 帖子详情     | `GET /posts/:postId`                        |
| PostDetail.vue | 删除帖子     | `DELETE /posts/:postId`                     |
