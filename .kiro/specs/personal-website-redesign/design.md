# Design Document: Personal Website Redesign

## Overview

This design document outlines the technical architecture for transforming the existing Whitefir Studio website into a personal website while preserving its premium "big tech" aesthetic. The redesign maintains the existing tech stack (Tailwind CSS via CDN, Font Awesome, vanilla HTML/CSS/JavaScript) and introduces new personal content modules: mood calendar, journal system, and enhanced project showcase.

The design follows a component-based approach with reusable UI patterns, client-side data loading from JSON files, and a focus on performance and accessibility. All interactions maintain the signature smooth animations (300ms ease-in-out) and glassmorphism visual style.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser Client                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   index.html │  │ journal.html │  │ calendar.html│      │
│  │  (Homepage)  │  │   (Journal)  │  │    (Mood)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│         ┌──────────────────▼──────────────────┐              │
│         │     Shared Component Library        │              │
│         │  - Navigation Bar                   │              │
│         │  - Glassmorphism Cards              │              │
│         │  - Animation Controllers            │              │
│         │  - Data Loaders                     │              │
│         └──────────────────┬──────────────────┘              │
│                            │                                 │
│         ┌──────────────────▼──────────────────┐              │
│         │        Data Layer (JSON)            │              │
│         │  - /data/projects.json              │              │
│         │  - /data/moods.json                 │              │
│         │  - /data/journal-entries.json       │              │
│         └─────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: Vanilla JavaScript (ES6+)
- **CSS Framework**: Tailwind CSS 3.x (via CDN) + Custom CSS for advanced effects
- **Icons**: Font Awesome 6.x (via CDN)
- **Data Format**: JSON files for content storage
- **Hosting**: Static file hosting (Cloudflare Pages compatible)
- **Design Style**: Big Tech Minimalism (Linear/Vercel inspired)
- **Animation**: CSS cubic-bezier + Spring physics for tooltips

### File Structure

```
/
├── index.html                 # Homepage with hero and project grid
├── journal.html               # Journal listing page
├── calendar.html              # Mood calendar page
├── projects/
│   ├── magic-tower-wars.html  # Individual project pages
│   └── [other-projects].html
├── journal/
│   └── [entry-slug].html      # Individual journal entry pages
├── assets/
│   ├── images/                # Project screenshots, photos
│   ├── icons/                 # Custom icons (if any)
│   └── css/
│       └── custom.css         # Additional custom styles
├── js/
│   ├── main.js                # Core application logic
│   ├── components.js          # Reusable UI components
│   ├── animations.js          # Animation controllers
│   └── data-loader.js         # Data fetching utilities
└── data/
    ├── projects.json          # Project metadata
    ├── moods.json             # Mood calendar data
    └── journal-entries.json   # Journal entry metadata
```

## Components and Interfaces

### 0. Global Visual System (大厂极简主义风格)

**Purpose**: Establish the foundational visual language with Linear/Vercel-inspired minimalism, featuring deep backgrounds, refined shadows, and fluid typography.

**Color System**:
```css
:root {
  /* 深邃黑灰背景 */
  --bg-primary: hsl(240 10% 3.9%);
  --bg-secondary: hsl(240 10% 5%);
  
  /* 玻璃拟态 */
  --glass-bg: rgba(255, 255, 255, 0.05);
  --glass-border: rgba(255, 255, 255, 0.1);
  --glass-border-hover: rgba(255, 255, 255, 0.2);
  
  /* 强调色 */
  --accent-purple: #8b5cf6;
  --accent-blue: #3b82f6;
  
  /* 文字 */
  --text-primary: rgba(255, 255, 255, 0.95);
  --text-secondary: rgba(255, 255, 255, 0.70);
  --text-tertiary: rgba(255, 255, 255, 0.50);
}
```

**Background with Noise Texture**:
```css
body {
  background-color: var(--bg-primary);
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
  background-attachment: fixed;
}
```

**Fluid Typography with clamp()**:
```css
h1 {
  font-size: clamp(2rem, 5vw, 4rem);
  letter-spacing: -0.05em;
  line-height: 1.1;
}

h2 {
  font-size: clamp(1.5rem, 4vw, 3rem);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

h3 {
  font-size: clamp(1.25rem, 3vw, 2rem);
  letter-spacing: -0.02em;
  line-height: 1.3;
}

p, li {
  font-size: clamp(1rem, 2vw, 1.125rem);
  line-height: 1.7;
  color: var(--text-secondary);
  opacity: 0.7;
}
```

**Multi-Layer Diffuse Shadows**:
```css
.floating-element {
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2),
    0 8px 16px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.1);
}
```

**Stagger Animation for Lists**:
```css
@keyframes staggerFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-item {
  opacity: 0;
  animation: staggerFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.stagger-item:nth-child(1) { animation-delay: 0.1s; }
.stagger-item:nth-child(2) { animation-delay: 0.2s; }
.stagger-item:nth-child(3) { animation-delay: 0.3s; }
.stagger-item:nth-child(4) { animation-delay: 0.4s; }
.stagger-item:nth-child(5) { animation-delay: 0.5s; }
/* ... 继续为更多项目 */
```

**Spacing System (增加呼吸空间)**:
```css
.section {
  padding-top: 8rem;    /* py-32 instead of py-24 */
  padding-bottom: 8rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 2rem;
  padding-right: 2rem;
}

@media (min-width: 768px) {
  .container {
    padding-left: 3rem;
    padding-right: 3rem;
  }
}
```

**Refined Transitions**:
```css
* {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.interactive-element:hover {
  transform: translateY(-2px);
}
```

### 1. Navigation Component

**Purpose**: Persistent navigation bar across all pages with responsive hamburger menu on mobile.

**HTML Structure**:
```html
<nav class="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
  <div class="container mx-auto px-6 py-4">
    <div class="flex justify-between items-center">
      <a href="/" class="text-2xl font-bold tracking-tighter">Your Name</a>
      
      <!-- Desktop Menu -->
      <div class="hidden md:flex space-x-8">
        <a href="/#projects" class="nav-link">Projects</a>
        <a href="/calendar.html" class="nav-link">Mood Calendar</a>
        <a href="/journal.html" class="nav-link">Journal</a>
      </div>
      
      <!-- Mobile Menu Button -->
      <button id="mobile-menu-btn" class="md:hidden">
        <i class="fas fa-bars"></i>
      </button>
    </div>
    
    <!-- Mobile Menu -->
    <div id="mobile-menu" class="hidden md:hidden mt-4">
      <!-- Mobile links -->
    </div>
  </div>
</nav>
```

**Styling Classes**:
- `.nav-link`: `text-white/70 hover:text-white transition-colors duration-300`
- Active state: `text-white border-b-2 border-purple-500`

**JavaScript Interface**:
```javascript
class NavigationComponent {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.init();
  }
  
  init() {
    this.attachEventListeners();
    this.highlightActiveSection();
  }
  
  attachEventListeners() {
    // Toggle mobile menu
    // Smooth scroll for anchor links
  }
  
  highlightActiveSection() {
    // Detect current page/section and highlight nav link
  }
}
```

### 2. Glassmorphism Card Component (大厂极简风格升级)

**Purpose**: Reusable card component with premium glass effect featuring gradient borders and refined shadows for projects, journal entries, and other content.

**HTML Structure**:
```html
<div class="glass-card group">
  <div class="card-content">
    <!-- Card content here -->
  </div>
</div>
```

**Styling Classes**:
```css
.glass-card {
  @apply bg-white/5 backdrop-blur-md 
         rounded-xl p-6 transition-all
         hover:scale-[1.02];
  
  /* 极细渐变边框 (Border Beam 效果) */
  border: 1px solid transparent;
  background-image: 
    linear-gradient(hsl(240 10% 3.9%), hsl(240 10% 3.9%)),
    linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
  background-origin: border-box;
  background-clip: padding-box, border-box;
  
  /* 多层漫反射阴影 - 漂浮效果 */
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2),
    0 8px 16px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.1);
  
  /* 顶部微弱光泽 */
  position: relative;
}

.glass-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(255,255,255,0.1), 
    transparent);
}

.glass-card:hover {
  border-color: rgba(255,255,255,0.2);
  
  /* 悬浮时显示发光底座 */
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2),
    0 8px 16px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.1),
    0 0 40px rgba(139, 92, 246, 0.15); /* 紫色发光 */
}
```

**Variants**:
- **Project Card**: Includes image with aspect-video, title with line-clamp-2, description with line-clamp-3, tech tags
- **Journal Card**: Includes title, excerpt, date with uppercase small font, read time
- **Mood Day Card**: Includes date, mood indicator with glow, optional note

### 3. Project Showcase Component (优化显示)

**Purpose**: Display grid of project cards on homepage and detailed project pages with optimized layout preventing display issues.

**Data Interface** (`/data/projects.json`):
```json
{
  "projects": [
    {
      "id": "magic-tower-wars",
      "title": "Magic Tower Wars",
      "description": "A strategic tower defense game...",
      "thumbnail": "/assets/images/magic-tower-wars-thumb.webp",
      "screenshots": [
        "/assets/images/mtw-screenshot-1.webp",
        "/assets/images/mtw-screenshot-2.webp"
      ],
      "techStack": ["Unity", "C#", "Photon"],
      "liveUrl": "https://example.com/magic-tower-wars",
      "detailPage": "/projects/magic-tower-wars.html",
      "featured": true
    }
  ]
}
```

**JavaScript Interface**:
```javascript
class ProjectShowcase {
  constructor(containerId, dataUrl) {
    this.container = document.getElementById(containerId);
    this.dataUrl = dataUrl;
    this.projects = [];
  }
  
  async loadProjects() {
    const response = await fetch(this.dataUrl);
    const data = await response.json();
    this.projects = data.projects;
    this.render();
  }
  
  render() {
    // Generate project cards HTML with optimized layout
    // Apply stagger entrance animations
    // Attach event listeners
  }
  
  renderProjectCard(project) {
    // 使用 aspect-video 替代固定高度
    // 标题使用 line-clamp-2，描述使用 line-clamp-3
    // 响应式 padding：移动端较小，桌面端宽敞
    return `
      <div class="glass-card project-card group cursor-pointer 
                  p-4 sm:p-6 lg:p-8">
        <div class="aspect-video overflow-hidden rounded-lg mb-4">
          <img src="${project.thumbnail}" 
               alt="${project.title}"
               class="w-full h-full object-cover 
                      transition-transform duration-500
                      group-hover:scale-110" />
        </div>
        <h3 class="text-xl font-bold tracking-tighter 
                   line-clamp-2 mb-2">
          ${project.title}
        </h3>
        <p class="text-white/70 leading-relaxed 
                  line-clamp-3 mb-4">
          ${project.description}
        </p>
        <div class="flex flex-wrap gap-2">
          ${project.techStack.map(tech => 
            `<span class="tech-tag">${tech}</span>`
          ).join('')}
        </div>
      </div>
    `;
  }
}
```

**Enhanced Hover Effect**:
```css
.project-card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card:hover {
  /* 背景渐变偏移效果 */
  background-position: 100% 100%;
  
  /* 发光底座 */
  box-shadow: 
    0 1px 2px rgba(0, 0, 0, 0.3),
    0 4px 8px rgba(0, 0, 0, 0.2),
    0 8px 16px rgba(0, 0, 0, 0.15),
    0 16px 32px rgba(0, 0, 0, 0.1),
    0 0 60px rgba(139, 92, 246, 0.2);
}
```

### 4. Mood Calendar Component (Apple Health 风格精致交互)

**Purpose**: Interactive monthly calendar displaying daily mood entries with Apple Health-like refinement and spring physics animations.

**Data Interface** (`/data/moods.json`):
```json
{
  "moods": [
    {
      "date": "2024-01-15",
      "mood": "happy",
      "note": "Great day working on the website!",
      "color": "#10b981"
    },
    {
      "date": "2024-01-16",
      "mood": "neutral",
      "note": "Regular day",
      "color": "#6b7280"
    }
  ],
  "moodTypes": {
    "happy": { "color": "#10b981", "icon": "😊" },
    "sad": { "color": "#ef4444", "icon": "😢" },
    "excited": { "color": "#8b5cf6", "icon": "🤩" },
    "neutral": { "color": "#6b7280", "icon": "😐" },
    "anxious": { "color": "#f59e0b", "icon": "😰" }
  }
}
```

**JavaScript Interface**:
```javascript
class MoodCalendar {
  constructor(containerId, dataUrl) {
    this.container = document.getElementById(containerId);
    this.dataUrl = dataUrl;
    this.currentMonth = new Date();
    this.moods = [];
    this.moodTypes = {};
    this.tooltip = null;
  }
  
  async loadMoods() {
    const response = await fetch(this.dataUrl);
    const data = await response.json();
    this.moods = data.moods;
    this.moodTypes = data.moodTypes;
    this.render();
  }
  
  render() {
    // Generate calendar grid with subtle styling
    // Populate mood indicators with glow effects
    // Attach hover tooltips with spring animation
    // Apply fade transition for month changes
  }
  
  navigateMonth(direction) {
    // Fade out current month
    // Move to previous/next month
    // Fade in new month
    this.applyFadeTransition();
  }
  
  applyFadeTransition() {
    const grid = this.container.querySelector('.calendar-grid');
    grid.style.opacity = '0';
    setTimeout(() => {
      this.render();
      grid.style.opacity = '1';
    }, 200);
  }
  
  getMoodForDate(dateString) {
    return this.moods.find(m => m.date === dateString) || null;
  }
  
  renderDay(date, mood) {
    // 极其微妙的背景色区分日期
    // 有心情记录的日期显示扩散光圈
    const hasGlow = mood ? `box-shadow: 0 0 20px ${mood.color}40;` : '';
    
    return `
      <div class="calendar-day" 
           style="background: rgba(255,255,255,0.02); ${hasGlow}"
           data-date="${date}">
        ${mood ? `<span class="mood-icon">${mood.icon}</span>` : ''}
      </div>
    `;
  }
  
  showTooltip(event, mood) {
    // 创建毛玻璃悬浮框
    // 应用物理弹簧动画
    // 检测屏幕边缘并自动调整位置
    const tooltip = document.createElement('div');
    tooltip.className = 'mood-tooltip glass-card';
    tooltip.innerHTML = `
      <div class="font-bold">${mood.icon} ${mood.mood}</div>
      <div class="text-sm text-white/70">${mood.note}</div>
    `;
    
    // 弹簧动画
    tooltip.style.animation = 'springIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    // 边缘检测
    const rect = event.target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    
    if (rect.right + tooltipRect.width > window.innerWidth) {
      tooltip.style.right = '0';
    }
    if (rect.bottom + tooltipRect.height > window.innerHeight) {
      tooltip.style.bottom = '100%';
    }
    
    document.body.appendChild(tooltip);
    this.tooltip = tooltip;
  }
}
```

**HTML Structure**:
```html
<div class="mood-calendar">
  <div class="calendar-header flex justify-between items-center mb-8">
    <button id="prev-month" class="nav-btn glass-card p-3 
                                   hover:scale-110 transition-all">
      <i class="fas fa-chevron-left"></i>
    </button>
    <h2 id="current-month" class="text-2xl font-bold tracking-tighter">
      January 2024
    </h2>
    <button id="next-month" class="nav-btn glass-card p-3 
                                   hover:scale-110 transition-all">
      <i class="fas fa-chevron-right"></i>
    </button>
  </div>
  
  <div class="calendar-grid grid grid-cols-7 gap-1 
              transition-opacity duration-200">
    <!-- Day headers (Sun, Mon, Tue...) -->
    <!-- Day cells with subtle backgrounds -->
  </div>
  
  <div class="mood-legend mt-8 flex flex-wrap gap-4">
    <!-- Legend showing mood types with icons and colors -->
  </div>
</div>
```

**CSS Animations**:
```css
@keyframes springIn {
  0% {
    opacity: 0;
    transform: scale(0.8) translateY(-10px);
  }
  50% {
    transform: scale(1.05) translateY(0);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.mood-tooltip {
  position: absolute;
  z-index: 1000;
  padding: 1rem;
  min-width: 200px;
  pointer-events: none;
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.calendar-day:hover {
  background: rgba(255,255,255,0.05) !important;
  transform: scale(1.05);
}
```

### 5. Journal System Component (极简排版美化)

**Purpose**: Display journal entries with refined typography, minimalist design, and enhanced reading experience.

**Data Interface** (`/data/journal-entries.json`):
```json
{
  "entries": [
    {
      "id": "my-first-post",
      "title": "My First Journal Entry",
      "date": "2024-01-20",
      "excerpt": "Today I started building my personal website...",
      "content": "Full markdown or HTML content here...",
      "tags": ["web-development", "personal"],
      "readTime": 5,
      "detailPage": "/journal/my-first-post.html"
    }
  ]
}
```

**JavaScript Interface**:
```javascript
class JournalSystem {
  constructor(containerId, dataUrl) {
    this.container = document.getElementById(containerId);
    this.dataUrl = dataUrl;
    this.entries = [];
    this.filteredEntries = [];
    this.currentTag = null;
  }
  
  async loadEntries() {
    const response = await fetch(this.dataUrl);
    const data = await response.json();
    this.entries = data.entries;
    this.filteredEntries = this.entries;
    this.render();
  }
  
  filterByTag(tag) {
    if (tag === this.currentTag) {
      // 取消过滤
      this.currentTag = null;
      this.filteredEntries = this.entries;
    } else {
      this.currentTag = tag;
      this.filteredEntries = this.entries.filter(e => 
        e.tags.includes(tag)
      );
    }
    this.render();
  }
  
  render() {
    // Generate entry cards with minimalist styling
    // Render tag filter buttons
    // Apply stagger entrance animations
  }
  
  renderEntryCard(entry) {
    // 无边框设计，仅底部细线
    // 悬浮时才显示玻璃背景
    // 元数据使用小号全大写字体
    return `
      <article class="journal-entry-card group 
                      border-b border-white/5 pb-8 mb-8
                      transition-all duration-300
                      hover:bg-white/5 hover:backdrop-blur-md
                      hover:px-6 hover:py-4 hover:rounded-xl
                      hover:-mx-6 hover:-my-4 hover:mb-4">
        <h2 class="text-2xl font-bold tracking-tighter mb-3
                   group-hover:text-purple-400 transition-colors">
          ${entry.title}
        </h2>
        
        <div class="flex items-center gap-4 mb-4 
                    text-xs uppercase tracking-wider text-white/50">
          <time datetime="${entry.date}">
            ${new Date(entry.date).toLocaleDateString()}
          </time>
          <span>${entry.readTime} min read</span>
        </div>
        
        <p class="text-white/70 leading-relaxed mb-4">
          ${entry.excerpt}
        </p>
        
        <div class="flex flex-wrap gap-2">
          ${entry.tags.map(tag => `
            <span class="journal-tag 
                         px-3 py-1 rounded-full
                         bg-transparent border border-white/20
                         text-sm text-white/70
                         transition-all duration-300
                         hover:bg-white hover:text-black hover:border-white
                         cursor-pointer">
              ${tag}
            </span>
          `).join('')}
        </div>
      </article>
    `;
  }
  
  getAllTags() {
    const tagSet = new Set();
    this.entries.forEach(entry => {
      entry.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }
  
  renderTagFilters() {
    const tags = this.getAllTags();
    return `
      <div class="tag-filters flex flex-wrap gap-3 mb-12">
        <button class="filter-tag ${!this.currentTag ? 'active' : ''}"
                onclick="journalSystem.filterByTag(null)">
          All
        </button>
        ${tags.map(tag => `
          <button class="filter-tag ${this.currentTag === tag ? 'active' : ''}"
                  onclick="journalSystem.filterByTag('${tag}')">
            ${tag}
          </button>
        `).join('')}
      </div>
    `;
  }
}
```

**Enhanced Styling**:
```css
/* 极简列表样式 */
.journal-entry-card {
  cursor: pointer;
}

/* 标签样式 */
.journal-tag {
  font-size: 0.875rem;
  letter-spacing: 0.05em;
}

/* 过滤器标签 */
.filter-tag {
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.7);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.filter-tag:hover,
.filter-tag.active {
  background: white;
  color: black;
  border-color: white;
  transform: translateY(-2px);
}

/* 元数据样式 */
.journal-entry-card time,
.journal-entry-card .read-time {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 500;
}
```

### 6. Animation Controller

**Purpose**: Centralized animation management for scroll-triggered entrance animations and hover effects.

**JavaScript Interface**:
```javascript
class AnimationController {
  constructor() {
    this.observer = null;
    this.init();
  }
  
  init() {
    this.setupIntersectionObserver();
    this.attachHoverEffects();
  }
  
  setupIntersectionObserver() {
    // Create Intersection Observer for scroll animations
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, { threshold: 0.1 });
    
    // Observe all elements with .animate-on-scroll class
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      this.observer.observe(el);
    });
  }
  
  attachHoverEffects() {
    // Add hover listeners to interactive elements
  }
}
```

**CSS Animations**:
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-on-scroll {
  opacity: 0;
}
```

### 7. Data Loader Utility

**Purpose**: Centralized data fetching with error handling and caching.

**JavaScript Interface**:
```javascript
class DataLoader {
  constructor() {
    this.cache = new Map();
  }
  
  async fetchJSON(url, useCache = true) {
    // Check cache first
    if (useCache && this.cache.has(url)) {
      return this.cache.get(url);
    }
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Cache the result
      if (useCache) {
        this.cache.set(url, data);
      }
      
      return data;
    } catch (error) {
      console.error(`Failed to load data from ${url}:`, error);
      return this.getDefaultData(url);
    }
  }
  
  getDefaultData(url) {
    // Return empty default data structure based on URL
    if (url.includes('projects')) return { projects: [] };
    if (url.includes('moods')) return { moods: [], moodTypes: {} };
    if (url.includes('journal')) return { entries: [] };
    return {};
  }
  
  clearCache() {
    this.cache.clear();
  }
}
```

## Data Models

### Project Model

```javascript
{
  id: string,              // Unique identifier (kebab-case)
  title: string,           // Display title
  description: string,     // Short description (2-3 sentences)
  thumbnail: string,       // Path to thumbnail image (.webp)
  screenshots: string[],   // Array of screenshot paths
  techStack: string[],     // Array of technology names
  liveUrl: string,         // URL to live project (optional)
  detailPage: string,      // Path to detail page
  featured: boolean        // Whether to feature on homepage
}
```

**Validation Rules**:
- `id` must be lowercase with hyphens only
- `thumbnail` and `screenshots` must be valid paths
- `techStack` must contain at least one item
- `detailPage` must start with `/projects/`

### Mood Model

```javascript
{
  date: string,           // ISO date format (YYYY-MM-DD)
  mood: string,           // Mood type key (happy, sad, excited, etc.)
  note: string,           // Optional note (max 200 chars)
  color: string           // Hex color code
}
```

**Validation Rules**:
- `date` must be valid ISO date string
- `mood` must exist in `moodTypes` dictionary
- `color` must be valid hex color (#RRGGBB)
- `note` is optional but if present, max 200 characters

### Journal Entry Model

```javascript
{
  id: string,             // Unique identifier (kebab-case)
  title: string,          // Entry title
  date: string,           // ISO date format (YYYY-MM-DD)
  excerpt: string,        // Short excerpt (1-2 sentences)
  content: string,        // Full content (HTML or Markdown)
  tags: string[],         // Array of tag strings
  readTime: number,       // Estimated read time in minutes
  detailPage: string      // Path to detail page
}
```

**Validation Rules**:
- `id` must be lowercase with hyphens only
- `date` must be valid ISO date string
- `excerpt` max 200 characters
- `tags` must be lowercase with hyphens
- `readTime` must be positive integer
- `detailPage` must start with `/journal/`

### Mood Type Model

```javascript
{
  [moodKey: string]: {
    color: string,        // Hex color code
    icon: string          // Emoji or icon character
  }
}
```

**Example**:
```javascript
{
  "happy": { "color": "#10b981", "icon": "😊" },
  "sad": { "color": "#ef4444", "icon": "😢" }
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Interactive Elements Have Hover Feedback

*For any* interactive element (buttons, links, cards) on the website, when hovered, the element should apply a visual feedback effect (scale transform to 1.05x or brightness increase) with a transition duration of 300ms and ease-in-out timing.

**Validates: Requirements 1.4, 3.5**

### Property 2: Heading Typography Consistency

*For any* heading element (h1, h2, h3, h4, h5, h6) on the website, the element should have the `tracking-tighter` class or equivalent CSS letter-spacing property applied.

**Validates: Requirements 1.5**

### Property 3: Body Text Typography Consistency

*For any* body text element (p, li, span within content areas) on the website, the element should have the `leading-relaxed` class or equivalent CSS line-height property applied.

**Validates: Requirements 1.6**

### Property 4: Minimum Text Size Across Breakpoints

*For any* text element on the website, when tested at mobile (< 640px), tablet (640-1024px), and desktop (> 1024px) breakpoints, the computed font size should be at least 16px for body text and proportionally larger for headings.

**Validates: Requirements 2.4**

### Property 5: Touch Target Minimum Size

*For any* interactive element on mobile devices (viewport < 640px), the element should have a minimum touch target size of 44x44 pixels (including padding and border).

**Validates: Requirements 2.5**

### Property 6: Transition Animation Consistency

*For any* element with state changes (hover, focus, active), the element should have CSS transition properties with 300ms duration and ease-in-out timing function.

**Validates: Requirements 3.1, 3.2**

### Property 7: Scroll Animation on Viewport Entry

*For any* element marked with the `.animate-on-scroll` class, when the element enters the viewport, it should receive the `animate-fade-in-up` class and display a fade-in with upward slide animation.

**Validates: Requirements 3.4**

### Property 8: Project Card Navigation

*For any* project card displayed on the homepage, when clicked, the card should navigate to the project's detail page URL as specified in the project data.

**Validates: Requirements 4.2**

### Property 9: Project Detail Page Completeness

*For any* project detail page, the page should contain all required elements: project title, description, at least one screenshot, technology stack tags, a "Back to Home" button, and a "Try It Out" CTA button.

**Validates: Requirements 4.3, 4.4, 4.5**

### Property 10: Technology Stack Tag Display

*For any* project with a technology stack array, when rendered, the technologies should be displayed as individual tags in a cloud/flex layout with appropriate spacing.

**Validates: Requirements 4.6**

### Property 11: Calendar Grid Completeness

*For any* month and year combination, the mood calendar should render a grid containing the correct number of days for that month (accounting for leap years).

**Validates: Requirements 5.1**

### Property 12: Mood Indicator Display

*For any* date with a mood entry in the data, the corresponding calendar day cell should display a colored indicator using the color specified in the mood data.

**Validates: Requirements 5.2**

### Property 13: Mood Tooltip on Hover

*For any* calendar day cell with a mood entry, when hovered, a tooltip should appear displaying the mood type and optional note.

**Validates: Requirements 5.3**

### Property 14: Distinct Mood Colors

*For any* two different mood types in the mood types dictionary, they should have distinct color values (no two mood types share the same color).

**Validates: Requirements 5.5**

### Property 15: Journal Entry Date Sorting

*For any* set of journal entries loaded from data, when rendered in the journal list, the entries should be sorted by date in descending order (newest first).

**Validates: Requirements 6.1**

### Property 16: Journal Entry Navigation

*For any* journal entry preview card, when clicked, the card should navigate to the entry's detail page URL as specified in the entry data.

**Validates: Requirements 6.2**

### Property 17: Journal Entry Page Completeness

*For any* journal entry detail page, the page should contain all required elements: entry title, publication date, full content, optional tags (if present in data), and a "Back to Journal" button.

**Validates: Requirements 6.3, 6.4**

### Property 18: Journal Tag Filtering

*For any* tag selected in the journal filter, the displayed entries should only include entries that have that tag in their tags array.

**Validates: Requirements 6.5**

### Property 19: Journal Entry Preview Completeness

*For any* journal entry preview card, the card should display the entry title, excerpt, publication date, and estimated read time.

**Validates: Requirements 6.6**

### Property 20: Navigation Bar Presence

*For any* page on the website, the page should contain a navigation bar element with links to main sections (Home, Projects, Mood Calendar, Journal).

**Validates: Requirements 8.1**

### Property 21: Navigation Link Behavior

*For any* navigation link clicked, the website should either smoothly scroll to the target section (for anchor links) or navigate to the target page (for page links).

**Validates: Requirements 8.4**

### Property 22: Page SEO Metadata Completeness

*For any* page on the website, the page should contain a unique title tag, a meta description tag, and Open Graph tags (og:title, og:description, og:image).

**Validates: Requirements 9.1, 9.2, 9.3**

### Property 23: Image Alt Attributes

*For any* image element on the website, the image should have a non-empty alt attribute providing descriptive text.

**Validates: Requirements 9.4**

### Property 24: WebP Image Format Usage

*For any* image file referenced in the website (excluding external URLs), the image should use the .webp file format where technically feasible.

**Validates: Requirements 10.3**

### Property 25: Below-Fold Image Lazy Loading

*For any* image element that is initially below the viewport fold on page load, the image should have the `loading="lazy"` attribute applied.

**Validates: Requirements 10.5**

### Property 26: Glassmorphism Card Styling Completeness

*For any* element with the `.glass-card` class, the element should have all required glassmorphism styles: bg-white/5 background, backdrop-blur-md filter, border-white/10 border, hover:border-white/30 hover state, and subtle shadow effects.

**Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

### Property 27: JSON Data Structure Validity

*For any* JSON data file (projects.json, moods.json, journal-entries.json), when parsed, the data should conform to its respective model schema with all required fields present and correctly typed.

**Validates: Requirements 12.1, 12.2**

### Property 28: Data Loading Success

*For any* data file URL requested by the data loader, the loader should successfully fetch and parse the JSON data, returning a valid data object or a default empty structure on error.

**Validates: Requirements 12.3**

### Property 29: Data Loading Error Handling

*For any* malformed or missing data file, the data loader should catch the error, log an appropriate error message, and return a default empty data structure without crashing the application.

**Validates: Requirements 12.4**

### Property 30: Data Caching Behavior

*For any* data file URL, when requested multiple times with caching enabled, the second and subsequent requests should return the cached data without making additional network requests.

**Validates: Requirements 12.5**

## Error Handling

### Data Loading Errors

**Strategy**: Graceful degradation with user-friendly messages

**Implementation**:
```javascript
class DataLoader {
  async fetchJSON(url, useCache = true) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to load ${url}:`, error);
      
      // Show user-friendly error message
      this.showErrorMessage(`Unable to load content. Please try again later.`);
      
      // Return empty default data to prevent crashes
      return this.getDefaultData(url);
    }
  }
  
  showErrorMessage(message) {
    // Display toast notification or inline error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-toast glass-card border-red-500/50';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => errorDiv.remove(), 5000);
  }
}
```

### Invalid Data Format Errors

**Strategy**: Validate data structure and provide defaults for missing fields

**Implementation**:
```javascript
function validateProjectData(project) {
  const required = ['id', 'title', 'description', 'thumbnail', 'techStack'];
  const missing = required.filter(field => !project[field]);
  
  if (missing.length > 0) {
    console.warn(`Project ${project.id || 'unknown'} missing fields:`, missing);
    
    // Provide defaults
    return {
      id: project.id || 'unknown',
      title: project.title || 'Untitled Project',
      description: project.description || 'No description available.',
      thumbnail: project.thumbnail || '/assets/images/placeholder.webp',
      techStack: project.techStack || [],
      screenshots: project.screenshots || [],
      liveUrl: project.liveUrl || null,
      detailPage: project.detailPage || '#',
      featured: project.featured || false
    };
  }
  
  return project;
}
```

### Navigation Errors

**Strategy**: Fallback to homepage on invalid routes

**Implementation**:
```javascript
function handleNavigationError(targetUrl) {
  console.error(`Navigation failed: ${targetUrl}`);
  
  // Check if target exists
  if (targetUrl.startsWith('#')) {
    const element = document.querySelector(targetUrl);
    if (!element) {
      console.warn(`Anchor ${targetUrl} not found, staying on current page`);
      return;
    }
  }
  
  // For page navigation, let browser handle 404
  // Ensure 404.html exists with link back to homepage
}
```

### Animation Errors

**Strategy**: Degrade gracefully if animations fail

**Implementation**:
```javascript
class AnimationController {
  init() {
    try {
      this.setupIntersectionObserver();
    } catch (error) {
      console.warn('Intersection Observer not supported, disabling scroll animations');
      // Show all content immediately without animations
      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        el.style.opacity = '1';
      });
    }
  }
}
```

### Responsive Design Fallbacks

**Strategy**: Mobile-first approach with progressive enhancement

**Implementation**:
- Base styles assume mobile viewport
- Use `@media` queries to enhance for larger screens
- If JavaScript fails, CSS-only responsive layout still works
- Navigation menu degrades to always-visible list if JS disabled

## Testing Strategy

### Dual Testing Approach

This project will use both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing

**Library**: We will use **fast-check** (JavaScript property-based testing library) for implementing property tests.

**Configuration**:
- Each property test will run a minimum of 100 iterations
- Each test will be tagged with a comment referencing the design property
- Tag format: `// Feature: personal-website-redesign, Property N: [property text]`

**Example Property Test**:
```javascript
// Feature: personal-website-redesign, Property 15: Journal Entry Date Sorting
test('journal entries are sorted by date descending', () => {
  fc.assert(
    fc.property(
      fc.array(journalEntryArbitrary, { minLength: 2, maxLength: 20 }),
      (entries) => {
        const sorted = sortEntriesByDate(entries);
        
        // Check that each entry is newer than or equal to the next
        for (let i = 0; i < sorted.length - 1; i++) {
          const current = new Date(sorted[i].date);
          const next = new Date(sorted[i + 1].date);
          expect(current >= next).toBe(true);
        }
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Testing

**Library**: We will use **Jest** for unit testing.

**Focus Areas**:
- Specific examples of component rendering
- Edge cases (empty data, single item, maximum items)
- Error conditions (network failures, malformed data)
- Integration between components

**Example Unit Test**:
```javascript
describe('MoodCalendar', () => {
  test('displays current month on initial load', () => {
    const calendar = new MoodCalendar('calendar-container', '/data/moods.json');
    calendar.render();
    
    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    const displayedMonth = document.getElementById('current-month').textContent;
    
    expect(displayedMonth).toBe(currentMonth);
  });
  
  test('handles empty mood data gracefully', () => {
    const calendar = new MoodCalendar('calendar-container', '/data/empty-moods.json');
    calendar.moods = [];
    calendar.render();
    
    // Should still render calendar grid
    const grid = document.querySelector('.calendar-grid');
    expect(grid).toBeTruthy();
    expect(grid.children.length).toBeGreaterThan(0);
  });
});
```

### Test Coverage Goals

- **Component rendering**: 100% of components have render tests
- **Data loading**: All data loader functions tested with valid and invalid data
- **User interactions**: All click, hover, and navigation events tested
- **Responsive behavior**: All breakpoints tested
- **Error handling**: All error paths tested

### Manual Testing Checklist

While automated tests cover most functionality, manual testing is required for:

1. **Visual design verification**: Confirm glassmorphism effects render correctly across browsers
2. **Animation smoothness**: Verify 300ms transitions feel smooth and not janky
3. **Cross-browser compatibility**: Test on Chrome, Firefox, Safari, Edge
4. **Mobile device testing**: Test on actual iOS and Android devices
5. **Accessibility**: Test with screen readers and keyboard navigation
6. **Performance**: Verify page load times and animation performance

### Continuous Integration

- Run all tests on every commit
- Fail build if any test fails
- Generate coverage reports
- Run visual regression tests for UI components
