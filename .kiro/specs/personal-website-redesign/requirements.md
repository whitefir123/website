# Requirements Document

## Introduction

This document specifies the requirements for transforming the existing Whitefir Studio website into a personal website while maintaining the premium "big tech" aesthetic (minimalist black background #050505, glassmorphism cards, smooth animations). The redesign will add new personal content modules including a mood calendar, journal/blog system, and enhanced game project showcase, all while preserving the existing visual design language and technical architecture.

## Glossary

- **Website**: The personal website system being redesigned
- **Glassmorphism**: A design style using semi-transparent backgrounds with backdrop blur effects
- **Mood_Calendar**: An interactive calendar component displaying daily mood entries
- **Journal_System**: A blog/diary system for personal writing and reflections
- **Project_Showcase**: A gallery component displaying game projects with details
- **Hero_Section**: The main landing area of the homepage with primary messaging
- **CTA_Button**: Call-to-action button prompting user interaction
- **Responsive_Design**: Layout that adapts to different screen sizes (mobile, tablet, desktop)
- **Transition_Animation**: Smooth visual effects during state changes (300ms ease-in-out)

## Requirements

### Requirement 1: Visual Design Consistency (大厂极简主义风格)

**User Story:** As a visitor, I want the website to maintain a consistent premium aesthetic across all pages with a "big tech minimalist" style (Linear/Vercel), so that I experience a cohesive professional brand.

#### Acceptance Criteria

1. THE Website SHALL use hsl(240 10% 3.9%) as the primary background color for 60% of the visual space (更深邃的黑灰色)
2. THE Website SHALL apply glassmorphism styling with gradient borders (Border Beam effect) and subtle top gloss to 30% of the visual space
3. THE Website SHALL use accent colors (magic purple, tech blue) for 10% of the visual space
4. THE Website SHALL apply a subtle noise texture to the background for enhanced texture quality
5. WHEN any interactive element is hovered, THE Website SHALL apply a visual feedback effect with cubic-bezier(0.4, 0, 0.2, 1) timing
6. THE Website SHALL use tracking-tighter for all heading typography
7. THE Website SHALL use leading-relaxed with opacity-70 for all body text typography to create contrast
8. THE Website SHALL use clamp() function for fluid typography sizing
9. THE Website SHALL use multi-layer diffuse shadows instead of basic shadows to create floating effect
10. THE Website SHALL implement stagger effects for list elements entering viewport

### Requirement 2: Responsive Layout System

**User Story:** As a visitor on any device, I want the website to display properly and remain usable, so that I can access content regardless of my screen size.

#### Acceptance Criteria

1. WHEN the viewport width is below 640px, THE Website SHALL display mobile-optimized layouts
2. WHEN the viewport width is between 640px and 1024px, THE Website SHALL display tablet-optimized layouts
3. WHEN the viewport width is above 1024px, THE Website SHALL display desktop-optimized layouts
4. THE Website SHALL maintain readable text sizes across all breakpoints
5. THE Website SHALL ensure touch targets are at least 44x44px on mobile devices

### Requirement 3: Smooth Animation System (高级动效)

**User Story:** As a visitor, I want all interactions to feel smooth and responsive with professional-grade animations, so that the website feels polished and premium.

#### Acceptance Criteria

1. WHEN any element changes state, THE Website SHALL apply transition animations with cubic-bezier(0.4, 0, 0.2, 1) timing function
2. THE Website SHALL use stagger effects for list elements, making them enter viewport in sequence
3. WHEN scrolling to anchor links, THE Website SHALL apply smooth scroll behavior
4. WHEN elements enter the viewport, THE Website SHALL fade in and slide up
5. WHEN hovering over clickable elements, THE Website SHALL apply gradient shift or glow support effect (not just simple scale)
6. THE Website SHALL increase vertical spacing (py-24 to py-32) for more breathing space

### Requirement 4: Game Project Showcase (优化显示)

**User Story:** As a visitor, I want to browse game projects with detailed information in an optimized layout, so that I can understand the creator's work without display issues.

#### Acceptance Criteria

1. THE Website SHALL display a grid of project cards on the homepage with adaptive layout
2. WHEN a project card is clicked, THE Website SHALL navigate to a dedicated project detail page
3. THE Project_Detail_Page SHALL display project title, description, screenshots, and technology stack
4. THE Project_Detail_Page SHALL include a "Back to Home" floating button
5. THE Project_Detail_Page SHALL include a "Try It Out" CTA button linking to the live project
6. WHEN displaying technology stack, THE Website SHALL render tags in a cloud layout
7. THE Project_Card SHALL use aspect-video for thumbnail instead of fixed height to prevent distortion
8. THE Project_Card SHALL use line-clamp (2 lines for title, 3 lines for description) to prevent text overflow
9. WHEN hovering over project card, THE Website SHALL apply gradient shift or glow support effect
10. THE Project_Card SHALL adjust padding for mobile (smaller) and desktop (spacious) responsively

### Requirement 5: Mood Calendar System (Apple Health 风格精致交互)

**User Story:** As the website owner, I want to display my daily moods in an interactive calendar with Apple Health-like refinement, so that visitors can see my emotional journey with premium interaction quality.

#### Acceptance Criteria

1. THE Mood_Calendar SHALL display a monthly calendar grid with all days of the month using subtle background colors instead of thick borders
2. WHEN a day has a mood entry, THE Mood_Calendar SHALL display a colored indicator with a subtle diffuse glow effect
3. WHEN hovering over a day with a mood entry, THE Mood_Calendar SHALL display a glassmorphism tooltip with spring physics animation
4. THE Mood_Calendar_Tooltip SHALL automatically adjust position when near screen edges to prevent cutoff
5. THE Mood_Calendar SHALL support navigation between months with fade-in-out transition effects (not instant switch)
6. THE Mood_Calendar SHALL use distinct colors for different mood categories (happy, neutral, sad, excited, etc.)
7. WHEN the calendar loads, THE Mood_Calendar SHALL display the current month by default
8. THE Mood_Calendar SHALL use extremely subtle styling for date grid cells to maintain refinement

### Requirement 6: Journal/Blog System (极简排版美化)

**User Story:** As the website owner, I want to publish and display journal entries with refined typography and minimalist design, so that visitors have an enhanced reading experience.

#### Acceptance Criteria

1. THE Journal_System SHALL display a list of journal entries sorted by date (newest first)
2. WHEN a journal entry preview is clicked, THE Journal_System SHALL navigate to the full entry page
3. THE Journal_Entry_Page SHALL display title, date, content, and optional tags
4. THE Journal_Entry_Page SHALL include a "Back to Journal" navigation button
5. THE Journal_System SHALL support filtering entries by tags
6. WHEN displaying entry previews, THE Journal_System SHALL show title, excerpt, date, and read time estimate
7. THE Journal_Entry_Metadata (date, read time) SHALL use small uppercase font with increased letter-spacing
8. THE Journal_Tags SHALL use transparent background with thin border, changing to white background with black text on hover
9. THE Journal_Entry_List SHALL use borderless design with only bottom thin line, showing glass background only on hover
10. THE Journal_Entry_List SHALL maintain minimalist "no-border" aesthetic for premium feel

### Requirement 7: Homepage Hero Section

**User Story:** As a visitor landing on the homepage, I want to immediately understand who the website belongs to and what it offers, so that I can decide whether to explore further.

#### Acceptance Criteria

1. THE Hero_Section SHALL display a prominent heading introducing the website owner
2. THE Hero_Section SHALL include a brief tagline or description
3. THE Hero_Section SHALL include navigation links to main sections (Projects, Mood Calendar, Journal)
4. WHEN the page loads, THE Hero_Section SHALL animate in with a fade and slide effect
5. THE Hero_Section SHALL include social media links with icon buttons

### Requirement 8: Navigation System

**User Story:** As a visitor, I want to easily navigate between different sections of the website, so that I can find the content I'm interested in.

#### Acceptance Criteria

1. THE Website SHALL display a persistent navigation bar on all pages
2. THE Navigation_Bar SHALL include links to Home, Projects, Mood Calendar, and Journal sections
3. WHEN on mobile devices, THE Navigation_Bar SHALL collapse into a hamburger menu
4. WHEN a navigation link is clicked, THE Website SHALL smoothly scroll to the target section or navigate to the target page
5. THE Navigation_Bar SHALL highlight the current active section

### Requirement 9: SEO and Metadata

**User Story:** As the website owner, I want the website to be discoverable and shareable on search engines and social media, so that I can reach a wider audience.

#### Acceptance Criteria

1. THE Website SHALL include a unique title tag on every page
2. THE Website SHALL include a meta description tag on every page
3. THE Website SHALL include Open Graph tags for social media sharing on every page
4. WHEN images are used, THE Website SHALL include descriptive alt attributes
5. THE Website SHALL prioritize loading of hero images

### Requirement 10: Asset Management

**User Story:** As a developer, I want assets to be organized and optimized, so that the website loads quickly and is easy to maintain.

#### Acceptance Criteria

1. THE Website SHALL store all static images in /assets/images/ directory
2. THE Website SHALL store all icons in /assets/icons/ directory
3. WHERE possible, THE Website SHALL use .webp format for images
4. THE Website SHALL use lowercase filenames with hyphens (no spaces or special characters)
5. THE Website SHALL lazy-load images below the fold

### Requirement 11: Glassmorphism Card Component

**User Story:** As a visitor, I want content cards to have a premium glass-like appearance, so that the website feels modern and high-quality.

#### Acceptance Criteria

1. THE Card_Component SHALL use bg-white/5 as the background color
2. THE Card_Component SHALL apply backdrop-blur-md filter
3. THE Card_Component SHALL use border-white/10 as the default border color
4. WHEN a card is hovered, THE Card_Component SHALL change border color to border-white/30
5. THE Card_Component SHALL include subtle shadow effects

### Requirement 12: Data Persistence

**User Story:** As the website owner, I want mood calendar and journal data to be stored and retrieved efficiently, so that content persists across sessions.

#### Acceptance Criteria

1. THE Website SHALL store mood calendar data in a structured JSON format
2. THE Website SHALL store journal entries in individual JSON or Markdown files
3. WHEN the page loads, THE Website SHALL fetch and parse data files
4. THE Website SHALL handle missing or malformed data gracefully with error messages
5. THE Website SHALL cache loaded data to minimize repeated file reads

### Requirement 13: Dynamic Cursor Follow Glow (动态光影)

**User Story:** As a visitor, I want to see a subtle radial gradient glow that follows my cursor, so that the dark background feels more dynamic and premium.

#### Acceptance Criteria

1. THE Website SHALL implement a cursor-following radial gradient glow effect on the body element
2. THE Cursor_Glow SHALL use rgba(139, 92, 246, 0.08) as the glow color (magic purple)
3. THE Cursor_Glow SHALL be extremely subtle and only visible on the dark background
4. THE Cursor_Glow SHALL smoothly follow the mouse cursor position
5. THE Cursor_Glow SHALL not interfere with text readability or other UI elements

### Requirement 14: Bento Grid Layout (便当盒布局)

**User Story:** As a visitor, I want to see project cards displayed in an irregular but aligned Bento Grid layout, so that the design feels more sophisticated and breaks visual monotony.

#### Acceptance Criteria

1. THE Project_Showcase SHALL use a Bento Grid layout instead of uniform grid
2. THE Featured_Project SHALL occupy a 2x1 or 1x2 grid space (larger than regular cards)
3. THE Bento_Grid SHALL maintain visual alignment and balance
4. THE Bento_Grid SHALL be responsive and adapt to different screen sizes
5. THE Bento_Grid SHALL use CSS Grid with explicit grid-template-areas or grid-column/row spans

### Requirement 15: Gradient Border Enhancement (边框美学)

**User Story:** As a visitor, I want to see ultra-thin gradient borders on glass cards that simulate metallic edges, so that the design feels more refined and premium.

#### Acceptance Criteria

1. THE Glass_Card SHALL use conic-gradient for border simulation
2. THE Border_Gradient SHALL be extremely thin (0.5px visual thickness)
3. THE Border_Gradient SHALL smoothly transition between transparent and white/purple tones
4. THE Border_Gradient SHALL enhance the floating effect of cards
5. THE Border_Gradient SHALL be visible but not overwhelming

### Requirement 16: Dramatic Typography with Gradient Text (排版升级)

**User Story:** As a visitor, I want to see hero section headings with dramatic gradient text effects, so that the typography feels more premium and eye-catching.

#### Acceptance Criteria

1. THE Hero_Section h1 SHALL use bg-clip-text for gradient text effect
2. THE Text_Gradient SHALL smoothly transition from white to light gray
3. THE Hero_Section h1 SHALL maintain tracking-tighter for tight letter spacing
4. THE Text_Gradient SHALL be readable and not compromise accessibility
5. THE Text_Gradient SHALL enhance the visual hierarchy of the page

### Requirement 17: Spring Physics Animation (弹性物理曲线)

**User Story:** As a visitor, I want all transform animations to use spring physics curves, so that interactions feel more natural and premium.

#### Acceptance Criteria

1. THE Website SHALL replace standard ease-out with cubic-bezier(0.175, 0.885, 0.32, 1.275) for transform animations
2. THE Spring_Curve SHALL apply to card hover effects
3. THE Spring_Curve SHALL apply to entrance animations
4. THE Spring_Curve SHALL create a subtle bounce-back effect
5. THE Spring_Curve SHALL not be overly exaggerated or distracting

### Requirement 18: Line Reveal Animation (遮罩入场)

**User Story:** As a visitor, I want to see text lines slide up from hidden boxes when entering viewport, so that content reveals feel more cinematic and premium.

#### Acceptance Criteria

1. THE Project_Card titles and descriptions SHALL use line reveal animation
2. THE Line_Reveal SHALL create the effect of text sliding up from a hidden container
3. THE Line_Reveal SHALL be staggered for multiple lines
4. THE Line_Reveal SHALL use overflow-hidden and translateY transforms
5. THE Line_Reveal SHALL complete within 0.6-0.8 seconds

### Requirement 19: Seamless Page Transitions (无缝页面过渡)

**User Story:** As a visitor, I want smooth fade transitions between page navigations, so that the browsing experience feels seamless and premium.

#### Acceptance Criteria

1. THE Website SHALL implement page transition effects using document.startViewTransition API where supported
2. WHEN the API is not supported, THE Website SHALL use a full-screen fade overlay
3. THE Page_Transition SHALL fade out the current page before navigation
4. THE Page_Transition SHALL fade in the new page after load
5. THE Page_Transition SHALL complete within 300-400ms

### Requirement 20: Enhanced Parallax Scrolling (滚动视差增强)

**User Story:** As a visitor, I want to see background elements move slower than foreground content when scrolling, so that the page feels more immersive with depth.

#### Acceptance Criteria

1. THE Hero_Section background grid SHALL move slower than foreground text
2. THE Parallax_Effect SHALL create a sense of 3D depth
3. THE Parallax_Effect SHALL be subtle and not cause motion sickness
4. THE Parallax_Effect SHALL use requestAnimationFrame for smooth performance
5. THE Parallax_Effect SHALL be disabled on mobile devices to preserve performance

### Requirement 21: Calendar-Journal Data Linking (日历与日志互通)

**User Story:** As a visitor, I want to click on a mood calendar date and see if there's a journal entry for that day, so that I can explore the connection between mood and writing.

#### Acceptance Criteria

1. WHEN a calendar date with a mood entry is clicked, THE Website SHALL check if a journal entry exists for that date
2. IF a journal entry exists, THE Mood_Tooltip SHALL display a "View Journal Entry" link
3. WHEN the link is clicked, THE Website SHALL navigate to the corresponding journal entry page
4. THE Link SHALL be visually distinct and clearly actionable
5. THE Feature SHALL work bidirectionally (calendar → journal)

### Requirement 22: Journal Mood Color Indicator (日志心情色标)

**User Story:** As a visitor, I want to see a colored vertical line on journal entry cards that matches the mood for that day, so that I can visually connect emotions with writing.

#### Acceptance Criteria

1. THE Journal_Entry_Card SHALL display a 2px wide vertical line on the left side or top
2. THE Color_Indicator SHALL automatically match the mood color from moods.json for that date
3. IF no mood exists for that date, THE Color_Indicator SHALL use a neutral gray color
4. THE Color_Indicator SHALL be subtle but visible
5. THE Color_Indicator SHALL enhance the visual storytelling of the journal

### Requirement 23: Mood Legend Interactive Filtering (心情图例交互)

**User Story:** As a visitor, I want to click on a mood type in the legend to highlight only dates with that mood, so that I can focus on specific emotional patterns.

#### Acceptance Criteria

1. WHEN a mood type in the legend is clicked, THE Calendar SHALL dim all dates without that mood
2. THE Filtered_Dates SHALL remain at full opacity while others reduce to 20% opacity
3. WHEN the same mood type is clicked again, THE Calendar SHALL reset to show all dates normally
4. THE Active_Filter SHALL be visually indicated in the legend
5. THE Feature SHALL support toggling between different mood filters

### Requirement 24: Empty State Design (空状态美化)

**User Story:** As a visitor, I want to see elegant empty state designs when no content is available, so that the experience feels polished even with missing data.

#### Acceptance Criteria

1. WHEN no journal entries exist, THE Journal_Page SHALL display a glassmorphism empty state card
2. WHEN no mood data exists for a month, THE Calendar SHALL display an empty state message
3. THE Empty_State SHALL include a relevant icon with glassmorphism styling
4. THE Empty_State SHALL include encouraging text (e.g., "No entries yet. Start writing!")
5. THE Empty_State SHALL maintain the overall design aesthetic
