# 需求文档：心情记录和日志系统增强

## 简介

本功能旨在为 whitefir.top 个人网站增强心情记录和日志系统，提供完整的心情追踪、日志撰写和数据统计能力。系统将包含交互式心情记录界面、富文本日志编辑器和智能搜索统计功能，所有功能均遵循 Whitefir Studio 的"极致、专业、丝滑"设计哲学。

## 术语表

- **心情日历系统（Mood_Calendar_System）**：展示和管理用户每日心情记录的日历界面组件
- **心情记录对话框（Mood_Record_Modal）**：用于创建新心情记录的弹出式交互界面
- **日志编辑器（Journal_Editor）**：支持富文本/Markdown 编辑的日志撰写界面
- **日志系统（Journal_System）**：管理日志条目的展示、过滤和搜索的核心模块
- **情绪统计面板（Emotion_Statistics_Panel）**：展示心情数据统计分析的可视化组件
- **心情类型配置（Mood_Types_Config）**：定义在 data/moods.json 中的心情选项数据结构
- **日志条目（Journal_Entry）**：符合 journal-entries.json 格式的单条日志数据对象

## 需求

### 需求 1：心情记录交互界面

**用户故事：** 作为网站访问者，我希望能够点击日历上的日期来记录当天的心情，以便追踪我的情绪变化。

#### 验收标准

1. WHEN 用户点击心情日历上没有记录的日期 THEN THE Mood_Calendar_System SHALL 显示心情记录对话框
2. WHEN 心情记录对话框显示时 THEN THE Mood_Record_Modal SHALL 展示所有在 Mood_Types_Config 中定义的心情选项（包含图标和标签）
3. WHEN 用户在对话框中选择心情类型并输入备注 THEN THE Mood_Record_Modal SHALL 收集数据并生成符合 moods.json 格式的 JSON 对象
4. WHEN 用户完成心情记录 THEN THE Mood_Calendar_System SHALL 在控制台输出生成的 JSON 对象并更新当前日历 UI 状态
5. WHEN 心情记录对话框打开或关闭时 THEN THE Mood_Record_Modal SHALL 执行平滑的淡入淡出动画（duration-300 ease-in-out）
6. WHEN 用户点击对话框外部区域 THEN THE Mood_Record_Modal SHALL 自动关闭
7. THE Mood_Record_Modal SHALL 使用玻璃拟态效果（bg-white/5 + backdrop-blur-md + border-white/10）
8. WHEN 用户在移动设备上操作时 THEN THE Mood_Record_Modal SHALL 适配小屏幕尺寸并保持可用性

### 需求 2：日志撰写页面

**用户故事：** 作为内容创作者，我希望有一个功能完善的日志编辑器，以便撰写和预览我的日志内容。

#### 验收标准

1. THE Journal_Editor SHALL 创建为独立的 journal-editor.html 页面，并继承 journal.html 的视觉风格
2. THE Journal_Editor SHALL 包含标题输入框、摘要输入框、标签多选器和正文编辑区四个核心输入组件
3. THE Journal_Editor SHALL 在页面左侧提供实时预览区域，展示根据 Journal_System 逻辑生成的日志卡片样式
4. THE Journal_Editor SHALL 提供"关联今日心情"下拉菜单，颜色样式与 Mood_Types_Config 保持一致
5. WHEN 用户在编辑器中输入内容时 THEN THE Journal_Editor SHALL 实时更新左侧预览区域
6. THE Journal_Editor SHALL 通过 js/journal-editor.js 处理表单数据收集
7. WHEN 用户提交日志时 THEN THE Journal_Editor SHALL 生成符合 journal-entries.json 格式的数据对象
8. WHEN 用户提交日志时 THEN THE Journal_Editor SHALL 在控制台输出生成的 JSON 对象
9. THE Journal_Editor SHALL 在桌面端（lg 及以上）使用左右分栏布局，在移动端（sm 以下）使用上下堆叠布局
10. THE Journal_Editor SHALL 包含"返回日志列表"的导航按钮

### 需求 3：日志搜索与统计增强

**用户故事：** 作为网站访问者，我希望能够快速搜索日志并查看心情统计数据，以便更好地了解内容和情绪趋势。

#### 验收标准

1. THE Journal_System SHALL 在 journal.html 的标签过滤器上方添加搜索输入框
2. WHEN 用户在搜索框中输入文本时 THEN THE Journal_System SHALL 对日志标题和摘要进行实时模糊搜索
3. WHEN 搜索结果更新时 THEN THE Journal_System SHALL 仅显示匹配的日志条目
4. WHEN 搜索框为空时 THEN THE Journal_System SHALL 显示所有日志条目（受标签过滤器影响）
5. THE Mood_Calendar_System SHALL 在 calendar.html 的心情日历下方添加情绪统计面板
6. THE Emotion_Statistics_Panel SHALL 统计当前月份各类心情出现的频率
7. THE Emotion_Statistics_Panel SHALL 使用百分比进度条形式展示每种心情的占比
8. THE Emotion_Statistics_Panel SHALL 使用与 Mood_Types_Config 一致的颜色方案
9. WHEN 用户在移动设备（屏幕宽度 < 640px）上查看心情日历时 THEN THE Mood_Calendar_System SHALL 缩小日期文字大小并调整网格间距以防止内容溢出
10. WHEN 用户切换日历月份时 THEN THE Emotion_Statistics_Panel SHALL 更新统计数据以反映新月份的心情分布

### 需求 4：视觉与交互一致性

**用户故事：** 作为 Whitefir Studio 的首席工程师，我希望所有新功能都遵循既定的设计规范，以便保持网站的专业品质。

#### 验收标准

1. THE Mood_Record_Modal SHALL 遵循 60-30-10 配色原则（60% 纯黑背景 #050505，30% 玻璃拟态/深灰，10% 强调色）
2. THE Journal_Editor SHALL 遵循 60-30-10 配色原则
3. THE Emotion_Statistics_Panel SHALL 遵循 60-30-10 配色原则
4. WHEN 用户与任何可点击元素交互时 THEN THE 系统 SHALL 提供 Hover 态视觉反馈（轻微放大 1.05x 或亮度提升）
5. WHEN 页面滚动到新区块时 THEN THE 系统 SHALL 执行淡入并向上滑动的进入动画
6. THE 系统 SHALL 为所有交互元素应用 transition-all duration-300 ease-in-out 动效
7. THE 系统 SHALL 在标题中使用 tracking-tighter（紧凑字间距）
8. THE 系统 SHALL 在正文中使用 leading-relaxed（宽松行高）
9. THE 系统 SHALL 确保所有新增页面包含完整的 SEO 元数据（title、description、Open Graph 标签）
10. THE 系统 SHALL 确保所有图片包含 alt 属性

### 需求 5：数据格式与兼容性

**用户故事：** 作为开发者，我希望新功能生成的数据格式与现有系统兼容，以便未来集成后端存储。

#### 验收标准

1. WHEN 生成心情记录数据时 THEN THE Mood_Record_Modal SHALL 生成包含 date、mood、note 字段的 JSON 对象
2. WHEN 生成日志条目数据时 THEN THE Journal_Editor SHALL 生成包含 id、title、excerpt、content、tags、mood、date 字段的 JSON 对象
3. THE 系统 SHALL 确保生成的心情记录数据格式与 data/moods.json 的现有结构兼容
4. THE 系统 SHALL 确保生成的日志条目数据格式与 data/journal-entries.json 的现有结构兼容
5. WHEN 生成唯一标识符时 THEN THE 系统 SHALL 使用时间戳或 UUID 确保 ID 唯一性
