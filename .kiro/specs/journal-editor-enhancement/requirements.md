# 需求文档：日志编辑器增强

## 简介

本功能旨在提升日志编辑器和心情记录系统的专业度、安全性和用户体验，使其达到"大厂"级别的交互质感。通过增强 Markdown 预览、本地草稿保存、数据导出、动效优化和统计功能，为用户提供极致、专业、丝滑的日志记录体验。

## 术语表

- **Journal_Editor**: 日志编辑器系统，负责日志内容的创建、编辑和预览
- **Mood_Record_Modal**: 心情记录弹窗组件，用于记录每日心情状态
- **Mood_Calendar**: 心情日历组件，展示历史心情记录
- **Emotion_Statistics**: 情绪统计模块，分析和展示心情数据趋势
- **LocalStorage**: 浏览器本地存储，用于持久化草稿数据
- **Markdown**: 轻量级标记语言，用于格式化文本内容
- **Spring_Bounce**: 弹性动画效果，模拟物理弹簧运动
- **Backdrop_Blur**: 背景模糊效果，用于玻璃拟态设计

## 需求

### 需求 1：Markdown 实时预览

**用户故事：** 作为日志作者，我希望在编辑时能实时看到 Markdown 格式化后的效果，以便更好地组织内容结构。

#### 验收标准

1. WHEN 用户在编辑器中输入 Markdown 语法 THEN THE Journal_Editor SHALL 实时解析并在预览区域显示格式化结果
2. THE Journal_Editor SHALL 支持标题语法（# ## ### 等）的解析和渲染
3. THE Journal_Editor SHALL 支持加粗语法（**text** 或 __text__）的解析和渲染
4. THE Journal_Editor SHALL 支持列表语法（- 或 * 开头）的解析和渲染
5. WHEN 预览内容渲染时 THEN THE Journal_Editor SHALL 保持与整体设计风格一致的视觉效果

### 需求 2：本地草稿自动保存

**用户故事：** 作为日志作者，我希望系统能自动保存我的草稿，以便在意外关闭页面后能恢复未完成的内容。

#### 验收标准

1. WHEN 用户输入标题或内容时 THEN THE Journal_Editor SHALL 实时将数据存储到 LocalStorage
2. WHEN 页面加载时 THEN THE Journal_Editor SHALL 检查 LocalStorage 中是否存在未提交的草稿
3. IF 存在未提交草稿 THEN THE Journal_Editor SHALL 弹出确认对话框询问用户是否恢复
4. WHEN 用户选择恢复草稿 THEN THE Journal_Editor SHALL 将草稿内容填充到编辑器中
5. WHEN 用户成功提交日志 THEN THE Journal_Editor SHALL 清除 LocalStorage 中的草稿数据

### 需求 3：日志数据本地导出

**用户故事：** 作为日志作者，我希望能将日志导出为 JSON 文件保存到本地，以便备份或迁移数据。

#### 验收标准

1. THE Journal_Editor SHALL 在提交按钮旁显示"保存到本地"按钮
2. WHEN 用户点击"保存到本地"按钮 THEN THE Journal_Editor SHALL 将当前日志对象转换为 JSON 格式
3. WHEN JSON 数据生成后 THEN THE Journal_Editor SHALL 触发浏览器下载，文件名格式为 journal-YYYY-MM-DD-HHmmss.json
4. THE Journal_Editor SHALL 确保导出的 JSON 包含所有必要字段（标题、内容、时间戳、关联心情等）
5. WHEN 下载完成后 THEN THE Journal_Editor SHALL 显示成功提示

### 需求 4：心情关联视觉同步

**用户故事：** 作为日志作者，我希望"关联今日心情"下拉菜单的选项颜色与心情配置保持一致，以便快速识别不同心情。

#### 验收标准

1. WHEN 渲染"关联今日心情"下拉菜单时 THEN THE Journal_Editor SHALL 为每个选项应用对应心情的背景色
2. THE Journal_Editor SHALL 将心情背景色设置为 10% 透明度
3. THE Journal_Editor SHALL 确保文字颜色与背景色形成足够的对比度以保证可读性
4. WHEN 用户悬停在选项上时 THEN THE Journal_Editor SHALL 将透明度提升至 20% 并添加平滑过渡效果

### 需求 5：心情保存动效反馈

**用户故事：** 作为用户，我希望在保存心情记录后能看到明确的视觉反馈，以便确认操作成功。

#### 验收标准

1. WHEN 用户点击"保存"按钮 THEN THE Mood_Record_Modal SHALL 执行保存操作
2. WHEN 保存成功后 THEN THE Mood_Calendar SHALL 为对应日期单元格执行 spring-bounce 弹性动画
3. THE Mood_Calendar SHALL 在动画完成后在日期单元格上显示成功勾选标记
4. THE Mood_Calendar SHALL 使用 cubic-bezier(0.34, 1.56, 0.64, 1) 作为动画曲线
5. THE Mood_Record_Modal SHALL 在保存成功后自动关闭

### 需求 6：动态备注占位符

**用户故事：** 作为用户，我希望备注输入框的占位符能根据选中的心情类型变化，以便获得更贴心的引导。

#### 验收标准

1. WHEN 用户选择不同心情类型时 THEN THE Mood_Record_Modal SHALL 动态更新备注输入框的占位符文本
2. THE Mood_Record_Modal SHALL 为每种心情类型配置专属的占位符提示语
3. THE Mood_Record_Modal SHALL 确保占位符文本温暖、友好且符合心情语境
4. WHEN 占位符文本变化时 THEN THE Mood_Record_Modal SHALL 添加淡入过渡效果

### 需求 7：快捷心情记录

**用户故事：** 作为用户，我希望能通过双击日期快速记录"平静"心情，以便提高日常记录效率。

#### 验收标准

1. WHEN 用户双击日历中的日期单元格 THEN THE Mood_Calendar SHALL 自动记录该日期为"平静（neutral）"心情
2. THE Mood_Calendar SHALL 在快捷记录后执行与正常保存相同的动效反馈
3. THE Mood_Calendar SHALL 确保双击事件不会与单击事件冲突
4. IF 该日期已有心情记录 THEN THE Mood_Calendar SHALL 打开编辑弹窗而非快捷记录

### 需求 8：Modal 视觉优化

**用户故事：** 作为用户，我希望心情记录弹窗符合整体设计风格，以便获得一致的视觉体验。

#### 验收标准

1. THE Mood_Record_Modal SHALL 使用 backdrop-blur-sm 作为遮罩层模糊效果
2. THE Mood_Record_Modal SHALL 使用 hsl(240 10% 3.9%) 的 80% 透明度作为遮罩层背景色
3. THE Mood_Record_Modal SHALL 确保 Modal 内容区域符合 60-30-10 视觉原则
4. THE Mood_Record_Modal SHALL 为所有交互元素添加 duration-300 ease-in-out 过渡效果

### 需求 9：生活建议生成

**用户故事：** 作为用户，我希望系统能根据我的心情数据提供暖心的生活建议，以便获得情感支持。

#### 验收标准

1. WHEN 渲染月度统计时 THEN THE Emotion_Statistics SHALL 分析本月心情数据
2. THE Emotion_Statistics SHALL 识别出现频率最高的心情类型
3. THE Emotion_Statistics SHALL 根据主导心情类型生成对应的生活建议文本
4. THE Emotion_Statistics SHALL 在统计图表下方显示生活建议区域
5. THE Emotion_Statistics SHALL 确保建议文本温暖、积极且具有实用价值

### 需求 10：统计条动效升级

**用户故事：** 作为用户，我希望统计图表的展示更具动感和专业感，以便获得更好的视觉体验。

#### 验收标准

1. WHEN 统计条进入视口时 THEN THE Emotion_Statistics SHALL 触发入场动画
2. THE Emotion_Statistics SHALL 使用 cubic-bezier(0.34, 1.56, 0.64, 1) 作为动画曲线
3. THE Emotion_Statistics SHALL 让统计条从 0% 宽度伸展至目标百分比
4. THE Emotion_Statistics SHALL 为每个统计条设置递增的动画延迟以形成波浪效果
5. THE Emotion_Statistics SHALL 确保动画流畅且不影响页面性能

### 需求 11：交互式心情过滤

**用户故事：** 作为用户，我希望点击统计面板中的某种心情时，日历能高亮显示所有对应日期，以便快速查看特定心情的分布。

#### 验收标准

1. WHEN 用户点击统计面板中的某一心情类型 THEN THE Emotion_Statistics SHALL 触发过滤事件
2. THE Emotion_Statistics SHALL 调用 Mood_Calendar 的过滤方法并传递选中的心情类型
3. WHEN 过滤激活时 THEN THE Mood_Calendar SHALL 高亮显示所有匹配该心情类型的日期
4. THE Mood_Calendar SHALL 降低非匹配日期的透明度至 30%
5. WHEN 用户再次点击相同心情或点击"清除过滤"时 THEN THE Mood_Calendar SHALL 恢复所有日期的正常显示
