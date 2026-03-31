# 🚀 后端接口代码文档（Node.js + Express + MongoDB）

---

## 1️⃣ 项目结构

```bash
server/
├── app.js
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   ├── Post.js
│   └── Media.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── posts.js
│   └── media.js
├── middleware/
│   └── auth.js
└── utils/
    └── response.js
```

---

## 2️⃣ 安装依赖

```bash
npm init -y
npm install express mongoose jsonwebtoken bcryptjs cors dotenv
```

---

## 3️⃣ 数据库连接

### `config/db.js`

```js
const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb://root:k0U988eIj6g6nI13@updown-db-mongodb.ns-lnn76r5i.svc:27017",
  );
  console.log("MongoDB connected");
};

module.exports = connectDB;
```

---

## 4️⃣ 通用响应工具

### `utils/response.js`

```js
exports.success = (res, data = {}) => {
  res.json({
    code: 0,
    message: "ok",
    data,
  });
};

exports.error = (res, code, message) => {
  res.json({
    code,
    message,
    data: null,
  });
};
```

---

## 5️⃣ 鉴权中间件

### `middleware/auth.js`

```js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.json({ code: 4003, message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch {
    res.json({ code: 4003, message: "Token invalid" });
  }
};
```

---

## 6️⃣ 数据模型

### User

```js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    nickname: String,
    account: { type: String, unique: true },
    password: String,
    avatar: String,
    bio: String,
    phone: String,
    email: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
```

---

### Post

```js
const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    authorId: String,
    username: String,
    image: String,
    images: [String],
    ratio: String,
    title: String,
    content: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", PostSchema);
```

---

### Media

```js
const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema({
  mediaId: String,
  mediaRef: String,
  localPath: String,
  type: String,
});

module.exports = mongoose.model("Media", MediaSchema);
```

---

## 7️⃣ Auth 接口

### `routes/auth.js`

```js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { success, error } = require("../utils/response");

// 注册
router.post("/register", async (req, res) => {
  const { account, password } = req.body;

  const exist = await User.findOne({ account });
  if (exist) return error(res, 4090, "Account exists");

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    ...req.body,
    password: hash,
  });

  const token = jwt.sign({ id: user._id }, "secret");

  success(res, { accessToken: token, user });
});

// 登录
router.post("/login", async (req, res) => {
  const { account, password } = req.body;

  const user = await User.findOne({ account });
  if (!user) return error(res, 4001, "Invalid credentials");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return error(res, 4001, "Invalid credentials");

  const token = jwt.sign({ id: user._id }, "secret");

  success(res, { accessToken: token, user });
});

module.exports = router;
```

---

## 8️⃣ 用户接口

### `routes/users.js`

```js
const router = require("express").Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const { success } = require("../utils/response");

// 获取当前用户
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  success(res, { user });
});

// 更新资料
router.patch("/profile", auth, async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });
  success(res, { user });
});

module.exports = router;
```

---

## 9️⃣ Post CRUD

### `routes/posts.js`

```js
const router = require("express").Router();
const Post = require("../models/Post");
const auth = require("../middleware/auth");
const { success, error } = require("../utils/response");

// 创建
router.post("/", auth, async (req, res) => {
  const post = await Post.create({
    ...req.body,
    authorId: req.user.id,
  });
  success(res, { post });
});

// 列表
router.get("/", async (req, res) => {
  const { page = 1, pageSize = 20 } = req.query;

  const list = await Post.find()
    .skip((page - 1) * pageSize)
    .limit(Number(pageSize));

  const total = await Post.countDocuments();

  success(res, {
    list,
    pagination: { page, pageSize, total },
  });
});

// 详情
router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  success(res, { post });
});

// 更新
router.patch("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post.authorId !== req.user.id) {
    return error(res, 4003, "No permission");
  }

  Object.assign(post, req.body);
  await post.save();

  success(res, { post });
});

// 删除
router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post.authorId !== req.user.id) {
    return error(res, 4003, "No permission");
  }

  await post.deleteOne();
  success(res);
});

module.exports = router;
```

---

## 🔟 Media 接口

```js
const router = require("express").Router();
const Media = require("../models/Media");
const { success } = require("../utils/response");

// 登记索引
router.post("/local-index", async (req, res) => {
  const mediaId = "m_" + Date.now();

  const media = await Media.create({
    mediaId,
    mediaRef: `local://media/${mediaId}`,
    ...req.body,
  });

  success(res, media);
});

module.exports = router;
```

---

## 1️⃣1️⃣ 启动入口

### `app.js`

```js
const express = require("express");
const app = express();
const connectDB = require("./config/db");

app.use(express.json());

connectDB();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/posts"));
app.use("/api/media", require("./routes/media"));

app.listen(3000, () => {
  console.log("Server running on 3000");
});
```

---

所有文件语法检查通过，依赖已安装。项目结构如下：
project/
├── src/
│ ├── app.js # 入口，挂载所有路由
│ ├── config/
│ │ └── db.js # MongoDB 连接 + 索引初始化
│ ├── middleware/
│ │ └── auth.js # JWT Bearer token 鉴权
│ ├── routes/
│ │ ├── auth.js # POST /register POST /login GET /me POST /logout
│ │ ├── users.js # PATCH /users/profile
│ │ ├── posts.js # CRUD /posts /posts/:postId
│ │ └── media.js # POST/GET /media/local-index
│ └── utils/
│ └── response.js # success() / fail() 统一响应
├── package.json
└── entrypoint.sh
接口清单（Base: http://host:3000/api）
方法 路径 鉴权 说明
GET /health — 健康检查
POST /auth/register — 注册
POST /auth/login — 登录（支持 account / nickname）
GET /auth/me ✓ 获取当前用户
POST /auth/logout ✓ 登出
PATCH /users/profile ✓ 更新资料
POST /media/local-index ✓ 登记本地图片索引（幂等）
GET /media/local-index/:mediaId — 查询媒体索引
POST /posts ✓ 创建 Post
GET /posts — 列表（支持 page / pageSize / keyword / authorId）
GET /posts/:postId — Post 详情
PATCH /posts/:postId ✓ 更新 Post（仅作者）
DELETE /posts/:postId ✓ 删除 Post（仅作者）
启动方式：
bash entrypoint.sh # 开发
bash entrypoint.sh prod # 生产
全部任务已完成。以下是最终的项目结构和说明：
项目结构
project/
├── src/
│ ├── app.js # 服务入口，挂载路由、连接数据库
│ ├── config/
│ │ └── db.js # MongoDB 连接 + 集合索引初始化
│ ├── middleware/
│ │ └── auth.js # JWT Bearer token 鉴权中间件
│ ├── routes/
│ │ ├── auth.js # 注册 / 登录 / me / 登出
│ │ ├── users.js # 更新用户资料
│ │ ├── posts.js # Post CRUD
│ │ └── media.js # 本地图片索引登记 / 查询
│ └── utils/
│ └── response.js # success() / fail() 统一响应格式
├── package.json
├── entrypoint.sh
└── api.md
启动

# 开发

bash entrypoint.sh

# 生产

bash entrypoint.sh prod
关键设计点
所有响应严格遵循 { code, message, data } 格式，错误码与 api.md 一致
JWT 有效期 7 天，密码使用 bcryptjs hash 存储
Post 更新 / 删除均校验 authorId === currentUserId
媒体索引登记接口幂等，同一用户相同 localPath + type 直接返回已有索引
MongoDB 已在启动时建好唯一索引（users.id、users.account、posts.id、media_index.mediaId）
