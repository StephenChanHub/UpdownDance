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
