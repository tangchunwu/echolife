# Freesound API 音频集成笔记

## 1. Freesound API 访问方式

- 官网：https://freesound.org/apiv2/
- 文档：https://freesound.org/docs/api/
- 无需 OAuth2 即可搜索：使用 `token` 参数（API Key）即可执行只读搜索和预览下载
- OAuth2 仅在需要"上传/收藏/评论"等写操作时才必须

### 搜索接口

```
GET https://freesound.org/apiv2/search/text/?query=<关键词>&token=<API_KEY>&fields=id,name,previews
```

返回的 `previews["preview-hq-mp3"]` 字段是可直接 wget/curl 下载的 MP3 链接。

---

## 2. 下载音频文件的方法

```bash
# 搜索
curl "https://freesound.org/apiv2/search/text/?query=portal+whoosh&token=YOUR_API_KEY&fields=id,name,previews"

# 下载 preview（无需 OAuth）
wget -O public/audio/sfx/portal_enter.mp3 "<preview-hq-mp3 URL>"

# 批量并行下载示例
wget -O public/audio/bgm/menu_theme.mp3 "<URL>" &
wget -O public/audio/bgm/hall_ambient.mp3 "<URL>" &
wait
```

---

## 3. 本项目音频文件清单

### BGM（背景音乐）`public/audio/bgm/`

| 文件名 | 用途 | 搜索关键词 |
|---|---|---|
| `menu_theme.mp3` | 主菜单 | `ambient cinematic menu` |
| `hall_ambient.mp3` | 时空大厅 | `mystical hall ambient` |
| `past_theme.mp3` | 过去场景 | `nostalgic piano ambient` |
| `future_theme.mp3` | 未来场景 | `sci-fi electronic ambient` |
| `paradox_theme.mp3` | 悖论场景 | `tense dark ambient paradox` |

### SFX（音效）`public/audio/sfx/`

| 文件名 | 用途 | 搜索关键词 |
|---|---|---|
| `portal_enter.mp3` | 传送门穿越 | `portal whoosh transition` |
| `collect.mp3` | 收集道具 | `crystal collect pickup` |
| `ui_click.mp3` | UI 点击 | `ui button click` |
| `ui_hover.mp3` | UI 悬停 | `ui hover soft` |
| `typing.mp3` | 对话打字 | `typewriter typing` |
| `transition.mp3` | 场景过渡 | `scene transition swoosh` |
| `portal_unlock.mp3` | 传送门解锁 | `unlock chime portal` |
| `hourglass.mp3` | 沙漏交互 | `hourglass sand timer` |

---

## 4. 音频系统架构

```
src/systems/AudioManager.ts     # 单例，管理所有音频状态、淡入淡出
src/hooks/useAudio.ts           # React hooks，组件订阅音频状态
src/components/audio/BgmController.tsx  # 根据场景自动切换 BGM
```

### AudioManager 核心能力

- 单例模式（`AudioManager.getInstance()`）
- BGM 淡入淡出切换（1.5 秒）
- 全局音量 / 静音控制
- SFX 按需播放（`playSfx(name)`）
- 基于 Web Audio API（`<audio>` 标签 + Howler 风格封装）

### BgmController 逻辑

- 挂载在 `App.tsx` 顶层
- 监听 `gameStore.currentScene`
- scene → bgm 文件映射：
  ```ts
  { menu: 'menu_theme', hall: 'hall_ambient', past: 'past_theme',
    future: 'future_theme', paradox: 'paradox_theme' }
  ```

---

## 5. 各组件 SFX 集成位置

| 组件 | 音效 | 触发时机 |
|---|---|---|
| `Portal.tsx` | `portal_enter`, `portal_unlock` | 点击穿越 / 解锁条件满足 |
| `MemoryFragment.tsx` | `collect` | 拾取记忆碎片 |
| `DialoguePanel.tsx` | `typing`, `ui_click` | 每个字符显示 / 选项点击 |
| `Hourglass.tsx` | `hourglass` | 交互触发 |
| `ReturnPortal.tsx` | `portal_enter` | 穿越返回 |
| `MainMenu.tsx` | `ui_click`, `ui_hover` | 按钮点击 / 悬停 |
| `PauseMenu.tsx` | `ui_click` | 菜单项点击 |
| `TransitionOverlay.tsx` | `transition` | 过渡动画开始时 |

---

## 6. GameHUD / PauseMenu 音频控件

- `GameHUD` 右上角：静音快捷按钮（图标切换）
- `PauseMenu` 内：音量滑块 + BGM/SFX 独立开关
- 状态存储在 `gameStore`（`isMuted`, `volume`）

---

## 7. 踩过的坑

1. **目录问题**：wget 必须在项目根目录执行，否则路径不对
2. **Freesound preview 链接有时效性**：每次搜索返回的 URL 不同，建议下载后本地保存
3. **autoplay 限制**：浏览器要求用户交互后才能播放，BGM 在主菜单点击开始游戏后才启动
4. **打字音效频率**：每个字符都触发会过于密集，建议每 2-3 个字符触发一次

---

## 8. 下次复用模板

### 快速为新项目添加音频系统步骤

1. 用 Freesound API 搜索 + 下载音频到 `public/audio/`
2. 复制 `AudioManager.ts` + `useAudio.ts` 到新项目
3. 修改 `BgmController` 的场景映射
4. 在需要音效的组件里 `import { useAudio }` 并调用 `playSfx()`
5. 在 `App.tsx` 根组件挂载 `<BgmController />`
