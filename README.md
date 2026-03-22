# 时空回响（Temporal Echo）

一个基于 React、Three.js 和 Zustand 的 3D 叙事探索游戏原型。

玩家将在大厅、过去、未来与悖论空间之间穿梭，通过交互、对话、
道具收集与时间线解锁，逐步推进章节并触发不同结局。

## 项目特点

- 3D 场景探索：基于 `@react-three/fiber` 和 `three`
- 多时间线叙事：大厅、过去、未来、悖论四个核心场景
- 状态驱动玩法：使用 Zustand 管理章节、背包、对话与结局状态
- 音频反馈完整：包含 BGM、SFX、静音与音量控制
- UI 交互闭环：主菜单、HUD、背包、时间线视图、暂停菜单、结局页
- Supabase 预留：已包含客户端初始化与数据库迁移脚本

## 当前实现

目前仓库的核心重心是前端可交互原型，已具备以下能力：

- 进入游戏并输入玩家昵称
- 在不同时间场景之间探索与切换
- 触发对话、记录分支选择
- 收集道具并解锁新的时间线
- 查看 HUD、背包与时间线面板
- 根据标记状态进入不同结局页

当前仓库也包含 Supabase 表结构迁移文件，但前端数据持久化逻辑仍
处于预留阶段，尚未在主要流程中完整接入。

## 技术栈

- React 18
- TypeScript
- Vite 5
- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- `@react-three/postprocessing`
- Zustand
- Tailwind CSS
- Supabase

## 目录结构

```text
project/
├── public/
│   ├── audio/                # 背景音乐与交互音效
│   └── image.png             # 项目静态资源
├── src/
│   ├── components/
│   │   ├── audio/            # 音频控制组件
│   │   ├── three/            # 3D 场景、角色、物体、玩家控制
│   │   └── ui/               # 菜单、HUD、背包、结局等界面
│   ├── data/                 # 对话树与道具数据
│   ├── hooks/                # 输入、音频、计时等 Hooks
│   ├── lib/                  # 第三方服务封装
│   ├── shaders/              # 自定义着色器
│   ├── store/                # 全局游戏状态
│   ├── systems/              # 音频、对话等系统层
│   └── types/                # 领域类型定义
├── supabase/
│   └── migrations/           # 数据库迁移脚本
└── package.json
```

## 本地启动

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发环境

```bash
npm run dev
```

### 3. 构建生产版本

```bash
npm run build
```

### 4. 代码检查

```bash
npm run lint
npm run typecheck
```

## 环境变量

如果你后续要接入 Supabase，请在项目根目录创建 `.env`：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

说明：

- 当前仓库已忽略 `.env`，不会被提交
- 现阶段 Supabase 主要用于后续扩展存档、对话选择和时间线事件

## 数据库设计

仓库中已包含 Supabase 迁移脚本，主要表如下：

- `players`：玩家资料
- `game_saves`：存档数据
- `dialogue_choices`：对话选择记录
- `timeline_events`：时间线事件记录

这些表已经附带基础的 RLS 策略，用于限制玩家只能访问自己的数据。

## 操作方式

- `W / A / S / D`：移动
- 鼠标：旋转视角
- 点击场景中的可交互对象：触发交互
- `ESC`：打开或关闭暂停菜单

## 后续可扩展方向

- 接入 Supabase Auth 与真实存档读写
- 为暂停菜单补齐实际保存与读档能力
- 修复部分文本编码异常问题
- 增加更多分支节点、道具与结局条件
- 增强场景光照、特效与引导反馈

## 脚本

```json
{
  "dev": "vite",
  "build": "vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "typecheck": "tsc --noEmit -p tsconfig.app.json"
}
```

## 许可证

当前仓库未声明许可证。如需开源发布，建议补充明确的 LICENSE 文件。
