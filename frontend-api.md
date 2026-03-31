# UpDown 前端接口规范（最小可部署版本）

## 1. 目标与范围

本规范用于先落地 **最小可实现部署**（MVP），覆盖你当前前端功能：

1. 账号注册 / 登录
2. 资料修改 / 更新
3. Post 增删改查（CRUD）
4. `image` 字段采用“本地图片地址索引”机制

> 说明：本文件只定义接口逻辑与数据契约，不涉及具体后端代码实现。

---

## 2. 全局约定

## 2.1 Base URL

- 开发：`http://localhost:3000/api`
- 生产：`https://<your-domain>/api`

## 2.2 鉴权

- 登录成功后返回 `accessToken`（JWT 或随机 token）。
- 需要登录的接口在 Header 中传：

```http
Authorization: Bearer <accessToken>
```

## 2.3 通用响应结构

### 成功

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

### 失败

```json
{
  "code": 4001,
  "message": "Invalid credentials",
  "data": null
}
```

## 2.4 常用错误码

- `0`：成功
- `4000`：参数错误
- `4001`：账号或密码错误
- `4003`：未授权/Token 失效
- `4040`：资源不存在
- `4090`：资源冲突（账号已存在）
- `5000`：服务异常

---

## 3. 数据模型（前后端统一）

## 3.1 User

```json
{
  "id": "u_1001",
  "nickname": "Stephen",
  "account": "stephen_01",
  "avatar": "local://media/m_901",
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

## 3.2 Post

```json
{
  "id": "p_2001",
  "authorId": "u_1001",
  "username": "Stephen",
  "image": "local://media/m_901",
  "images": ["local://media/m_901", "local://media/m_902"],
  "ratio": "9:16",
  "title": "my post",
  "content": "content text",
  "createdAt": "2026-03-31T08:30:00.000Z",
  "updatedAt": "2026-03-31T08:30:00.000Z"
}
```

---

## 4. 本地图片地址索引机制（重点）

你要求 `image` 字段采取本地图片地址索引，MVP 推荐按下面方式定义：

1. 前端选图后，拿到临时路径（如 uni-app 的 `tempFilePath`）。
2. 先调用“媒体索引登记接口”，将本地路径登记成一个稳定索引（如 `local://media/m_901`）。
3. Post 创建/更新时只传索引字符串，不直接传原始本地路径。

这样可保证：

- Post 数据结构稳定
- 后端与前端解耦（后期可替换为对象存储 URL）

### 4.1 媒体索引登记接口

### `POST /media/local-index`

用于把本地路径登记为可复用索引。

**Request**

```json
{
  "localPath": "wxfile://tmp_abc.jpg",
  "type": "image"
}
```

**Response**

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "mediaId": "m_901",
    "mediaRef": "local://media/m_901",
    "localPath": "wxfile://tmp_abc.jpg",
    "type": "image"
  }
}
```

### 4.2 媒体索引解析接口（可选）

### `GET /media/local-index/:mediaId`

用于调试或后续扩展（返回对应 localPath 或可访问 URL）。

---

## 5. 账号接口

## 5.1 注册

### `POST /auth/register`

**Request**

```json
{
  "nickname": "Stephen",
  "account": "stephen_01",
  "password": "123456",
  "phone": "+86 13800138000",
  "email": "a@b.com",
  "avatar": "local://media/m_901"
}
```

**Response**

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "accessToken": "token_xxx",
    "user": {
      "id": "u_1001",
      "nickname": "Stephen",
      "account": "stephen_01",
      "avatar": "local://media/m_901",
      "bio": "",
      "phone": "+86 13800138000",
      "email": "a@b.com",
      "following": 0,
      "followers": 0,
      "likes": 0
    }
  }
}
```

## 5.2 登录

### `POST /auth/login`

**Request**

```json
{
  "account": "stephen_01",
  "password": "123456"
}
```

> 兼容当前前端，也可接受 `nickname + password` 登录（可选）。

**Response** 同注册。

## 5.3 获取当前用户

### `GET /auth/me`

**Header**：`Authorization: Bearer <token>`

**Response**

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "user": {
      "id": "u_1001",
      "nickname": "Stephen",
      "account": "stephen_01",
      "avatar": "local://media/m_901",
      "bio": "",
      "phone": "+86 13800138000",
      "email": "a@b.com",
      "following": 0,
      "followers": 0,
      "likes": 0
    }
  }
}
```

## 5.4 登出（可选）

### `POST /auth/logout`

MVP 可只由前端清 token；如果后端做黑名单可保留本接口。

---

## 6. 资料接口

## 6.1 更新资料

### `PATCH /users/profile`

**Header**：`Authorization: Bearer <token>`

**Request**（部分字段更新）

```json
{
  "nickname": "Stephen New",
  "account": "stephen_01",
  "bio": "new bio",
  "phone": "+86 13900000000",
  "email": "new@b.com",
  "avatar": "local://media/m_903"
}
```

**Response**

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "user": {
      "id": "u_1001",
      "nickname": "Stephen New",
      "account": "stephen_01",
      "avatar": "local://media/m_903",
      "bio": "new bio",
      "phone": "+86 13900000000",
      "email": "new@b.com",
      "following": 0,
      "followers": 0,
      "likes": 0
    }
  }
}
```

---

## 7. Post 接口（CRUD）

## 7.1 创建 Post

### `POST /posts`

**Header**：`Authorization: Bearer <token>`

**Request**

```json
{
  "image": "local://media/m_901",
  "images": ["local://media/m_901", "local://media/m_902"],
  "ratio": "9:16",
  "title": "my post",
  "content": "content"
}
```

**约束**

- `images` 最多 9 张
- `image` 建议等于 `images[0]`（前端封面）
- `ratio` 允许值：`9:16 | 1:1 | 16:9`

**Response**

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "post": {
      "id": "p_2001",
      "authorId": "u_1001",
      "username": "Stephen",
      "image": "local://media/m_901",
      "images": ["local://media/m_901", "local://media/m_902"],
      "ratio": "9:16",
      "title": "my post",
      "content": "content",
      "createdAt": "2026-03-31T08:30:00.000Z",
      "updatedAt": "2026-03-31T08:30:00.000Z"
    }
  }
}
```

## 7.2 Post 列表

### `GET /posts`

**Query**

- `page`（默认 1）
- `pageSize`（默认 20）
- `keyword`（搜索 username/title/content）
- `authorId`（按用户过滤）

**Response**

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100
    }
  }
}
```

## 7.3 Post 详情

### `GET /posts/:postId`

返回单条 post（用于 `PostDetail`）。

## 7.4 更新 Post

### `PATCH /posts/:postId`

**Header**：`Authorization: Bearer <token>`

**Request**

```json
{
  "image": "local://media/m_901",
  "images": ["local://media/m_901", "local://media/m_905"],
  "ratio": "1:1",
  "title": "edited title",
  "content": "edited content"
}
```

**规则**

- 仅作者本人可修改
- 可部分更新

## 7.5 删除 Post

### `DELETE /posts/:postId`

**Header**：`Authorization: Bearer <token>`

**规则**

- 仅作者本人可删除
- 删除成功后返回 `code=0`

---

## 8. 前端页面到接口映射（对接清单）

## 8.1 `Me.vue`

- 登录：`POST /auth/login`
- 注册：`POST /auth/register`
- 编辑资料：`PATCH /users/profile`
- 退出：前端清 token（可选 `POST /auth/logout`）
- 我的帖子：`GET /posts?authorId=<currentUserId>`

## 8.2 `Post.vue`

- 选图后先登记索引：`POST /media/local-index`（每张图）
- 新建：`POST /posts`
- 编辑：`PATCH /posts/:postId`

## 8.3 `Explore.vue`

- 列表：`GET /posts?page=1&pageSize=20`
- 搜索：`GET /posts?keyword=xxx`

## 8.4 `PostDetail.vue`

- 详情：`GET /posts/:postId`
- 删除：`DELETE /posts/:postId`
- 修改入口：跳转编辑页并在提交时走 `PATCH /posts/:postId`

---

## 9. 最小部署建议（可落地）

## 9.1 存储层建议

MVP 可用任一轻量方案：

- SQLite（推荐）
- JSON 文件（仅演示）

### 建议表结构

- `users`
- `posts`
- `media_index`（`mediaId`, `mediaRef`, `localPath`, `type`, `ownerId`）

## 9.2 安全最小集

- 密码必须哈希存储（如 bcrypt）
- 受保护接口必须验 token
- 更新/删除 Post 必须校验 `authorId == currentUserId`

---

## 10. 与你当前前端 Store 的契合点

- `authStore.ts`
  - `login/register/updateProfile/logout` 与上述接口一一对应
- `postStore.ts`
  - `createPost/updatePost/deletePost` 与 `/posts` 接口一致
  - `searchQuery` 对应 `GET /posts?keyword=`

当前前端从“本地内存 + localStorage”切换到 API 时，可保持方法名不变，内部实现替换为 HTTP 请求即可。

---

## 11. 迭代顺序（建议）

1. 完成 `auth`（注册/登录/me）
2. 完成 `profile` 更新
3. 完成 `media local-index` 登记
4. 完成 `posts` CRUD
5. 最后接入搜索/分页

这样能最短路径跑通“可注册、可登录、可编辑资料、可发帖改帖删帖查帖”的最小上线链路。
