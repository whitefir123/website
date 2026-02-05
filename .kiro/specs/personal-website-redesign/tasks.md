# Implementation Plan: Personal Website Redesign

## Overview

This implementation plan transforms the existing Whitefir Studio website into a personal website while maintaining the premium "big tech" aesthetic. The approach follows a component-first strategy, building reusable UI components before assembling them into complete pages. We'll implement the data layer early to enable realistic testing, then progressively enhance with animations and responsive behavior.

## Tasks

- [x] 1. Set up project structure and core utilities
  - Create directory structure (/js, /data, /assets, /journal, /projects)
  - Set up data loader utility with caching and error handling
  - Create shared CSS custom styles file
  - Initialize JSON data files with sample data (projects.json, moods.json, journal-entries.json)
  - _Requirements: 10.1, 10.2, 12.1, 12.2_

- [x] 1.1 Upgrade global visual system (大厂极简主义风格)
  - [x] 1.1.1 Update background color to hsl(240 10% 3.9%)
    - Replace #050505 with deeper black-gray
    - _Requirements: 1.1_
  
  - [x] 1.1.2 Add noise texture to background
    - Implement SVG noise filter
    - Add subtle radial gradients for depth
    - _Requirements: 1.4_
  
  - [x] 1.1.3 Implement fluid typography with clamp()
    - Apply clamp() to all heading sizes
    - Ensure responsive scaling
    - _Requirements: 1.8_
  
  - [x] 1.1.4 Update typography contrast
    - Add opacity-70 to body text
    - Maintain tracking-tighter for headings
    - _Requirements: 1.7_
  
  - [x] 1.1.5 Implement stagger animations for lists
    - Create staggerFadeIn keyframes
    - Apply sequential delays to list items
    - _Requirements: 1.10_
  
  - [x] 1.1.6 Increase vertical spacing
    - Change py-24 to py-32 globally
    - Add more breathing space
    - _Requirements: 3.6_

- [ ]* 1.2 Write property test for data loader
  - **Property 28: Data Loading Success**
  - **Validates: Requirements 12.3**

- [ ]* 1.3 Write property test for data caching
  - **Property 30: Data Caching Behavior**
  - **Validates: Requirements 12.5**

- [ ]* 1.4 Write property test for error handling
  - **Property 29: Data Loading Error Handling**
  - **Validates: Requirements 12.4**

- [ ] 2. Implement glassmorphism card component (大厂极简风格升级)
  - [x] 2.1 Create reusable glass-card CSS classes with all required styling
    - Implement bg-white/5, backdrop-blur-md, border-white/10
    - Add hover state with border-white/30
    - Add subtle shadow effects
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x] 2.1.1 Upgrade glass-card with gradient borders (Border Beam effect)
    - Implement ultra-thin gradient borders
    - Add top gloss effect
    - Apply multi-layer diffuse shadows for floating effect
    - Add glow support on hover
    - _Requirements: 1.2, 1.9_
  
  - [ ]* 2.2 Write property test for glassmorphism card styling
    - **Property 26: Glassmorphism Card Styling Completeness**
    - **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**

- [ ] 3. Implement navigation component
  - [x] 3.1 Create navigation bar HTML structure with responsive menu
    - Build fixed navigation bar with logo and links
    - Implement desktop menu and mobile hamburger menu
    - Add smooth scroll behavior for anchor links
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [x] 3.2 Implement navigation JavaScript functionality
    - Create NavigationComponent class
    - Add mobile menu toggle logic
    - Implement active section highlighting
    - Add smooth scroll for anchor links
    - _Requirements: 8.4, 8.5_
  
  - [ ]* 3.3 Write property test for navigation presence
    - **Property 20: Navigation Bar Presence**
    - **Validates: Requirements 8.1**
  
  - [ ]* 3.4 Write property test for navigation link behavior
    - **Property 21: Navigation Link Behavior**
    - **Validates: Requirements 8.4**

- [ ] 4. Implement animation system (高级动效升级)
  - [x] 4.1 Create animation controller with Intersection Observer
    - Implement AnimationController class
    - Set up scroll-triggered fade-in-up animations
    - Add CSS keyframes for entrance animations
    - _Requirements: 3.4_
  
  - [x] 4.2 Add global transition styles
    - Apply 300ms ease-in-out transitions to interactive elements
    - Implement hover scale effects (1.05x)
    - Add smooth scroll CSS
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 1.4_
  
  - [x] 4.2.1 Upgrade to cubic-bezier timing
    - Replace ease-in-out with cubic-bezier(0.4, 0, 0.2, 1)
    - Apply to all transitions globally
    - _Requirements: 3.1_
  
  - [x] 4.2.2 Implement stagger effects
    - Add sequential entrance animations for list items
    - Use Intersection Observer for trigger
    - _Requirements: 3.2_
  
  - [x] 4.2.3 Upgrade hover effects
    - Replace simple scale with gradient shift or glow support
    - Add more sophisticated hover interactions
    - _Requirements: 3.5_
  
  - [ ]* 4.3 Write property test for transition consistency
    - **Property 6: Transition Animation Consistency**
    - **Validates: Requirements 3.1, 3.2**
  
  - [ ]* 4.4 Write property test for hover effects
    - **Property 1: Interactive Elements Have Hover Feedback**
    - **Validates: Requirements 1.4, 3.5**
  
  - [ ]* 4.5 Write property test for scroll animations
    - **Property 7: Scroll Animation on Viewport Entry**
    - **Validates: Requirements 3.4**

- [ ] 5. Implement typography system
  - [x] 5.1 Apply typography classes globally
    - Add tracking-tighter to all heading elements
    - Add leading-relaxed to all body text elements
    - Ensure minimum 16px font size for body text
    - _Requirements: 1.5, 1.6, 2.4_
  
  - [ ]* 5.2 Write property test for heading typography
    - **Property 2: Heading Typography Consistency**
    - **Validates: Requirements 1.5**
  
  - [ ]* 5.3 Write property test for body text typography
    - **Property 3: Body Text Typography Consistency**
    - **Validates: Requirements 1.6**
  
  - [ ]* 5.4 Write property test for minimum text size
    - **Property 4: Minimum Text Size Across Breakpoints**
    - **Validates: Requirements 2.4**

- [x] 6. Checkpoint - Verify core systems
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement project showcase component (优化显示)
  - [x] 7.1 Create ProjectShowcase class with data loading
    - Implement loadProjects() method to fetch projects.json
    - Create renderProjectCard() method for card HTML generation
    - Add click handlers for navigation to detail pages
    - _Requirements: 4.1, 4.2, 4.6_
  
  - [x] 7.2 Build project card HTML template
    - Create glass-card with project thumbnail
    - Add project title, description, and tech stack tags
    - Implement tech stack tag cloud layout
    - _Requirements: 4.1, 4.6_
  
  - [x] 7.2.1 Optimize project card layout
    - Replace fixed height with aspect-video for thumbnails
    - Add line-clamp-2 for titles
    - Add line-clamp-3 for descriptions
    - Implement responsive padding (smaller on mobile, spacious on desktop)
    - _Requirements: 4.7, 4.8, 4.10_
  
  - [x] 7.2.2 Upgrade hover effects
    - Implement gradient shift on hover
    - Add glow support effect
    - Remove simple scale, use sophisticated animation
    - _Requirements: 4.9_
  
  - [ ]* 7.3 Write property test for project card navigation
    - **Property 8: Project Card Navigation**
    - **Validates: Requirements 4.2**
  
  - [ ]* 7.4 Write property test for tech stack display
    - **Property 10: Technology Stack Tag Display**
    - **Validates: Requirements 4.6**

- [ ] 8. Create project detail page template
  - [x] 8.1 Build project detail page HTML structure
    - Create template with all required sections
    - Add "Back to Home" floating button
    - Add "Try It Out" CTA button
    - Display project title, description, screenshots, tech stack
    - _Requirements: 4.3, 4.4, 4.5_
  
  - [ ]* 8.2 Write property test for project detail page completeness
    - **Property 9: Project Detail Page Completeness**
    - **Validates: Requirements 4.3, 4.4, 4.5**

- [ ] 9. Implement mood calendar component (Apple Health 风格精致交互)
  - [x] 9.1 Create MoodCalendar class with month rendering
    - Implement calendar grid generation for any month/year
    - Add previous/next month navigation buttons
    - Calculate correct number of days (including leap years)
    - _Requirements: 5.1, 5.4, 5.6_
  
  - [x] 9.2 Implement mood indicator display
    - Load mood data from moods.json
    - Render colored indicators on days with mood entries
    - Add hover tooltips with mood details
    - Ensure distinct colors for different mood types
    - _Requirements: 5.2, 5.3, 5.5_
  
  - [x] 9.2.1 Refine calendar grid styling
    - Remove thick borders
    - Use extremely subtle background colors for date cells
    - Implement minimalist aesthetic
    - _Requirements: 5.1, 5.8_
  
  - [x] 9.2.2 Add diffuse glow to mood indicators
    - Implement subtle glow effect for days with moods
    - Use mood color for glow
    - _Requirements: 5.2_
  
  - [x] 9.2.3 Upgrade tooltip to glassmorphism with spring animation
    - Create glassmorphism tooltip style
    - Implement spring physics animation (cubic-bezier with overshoot)
    - Add edge detection for automatic position adjustment
    - _Requirements: 5.3, 5.4_
  
  - [x] 9.2.4 Add fade transition for month navigation
    - Implement fade-out before month change
    - Implement fade-in after month change
    - Remove instant switching
    - _Requirements: 5.5_
  
  - [ ]* 9.3 Write property test for calendar grid completeness
    - **Property 11: Calendar Grid Completeness**
    - **Validates: Requirements 5.1**
  
  - [ ]* 9.4 Write property test for mood indicator display
    - **Property 12: Mood Indicator Display**
    - **Validates: Requirements 5.2**
  
  - [ ]* 9.5 Write property test for mood tooltip
    - **Property 13: Mood Tooltip on Hover**
    - **Validates: Requirements 5.3**
  
  - [ ]* 9.6 Write property test for distinct mood colors
    - **Property 14: Distinct Mood Colors**
    - **Validates: Requirements 5.5**

- [ ] 10. Implement journal system component (极简排版美化)
  - [x] 10.1 Create JournalSystem class with entry loading
    - Implement loadEntries() method to fetch journal-entries.json
    - Sort entries by date (newest first)
    - Create renderEntryCard() method for preview cards
    - _Requirements: 6.1, 6.6_
  
  - [x] 10.2 Implement tag filtering functionality
    - Extract all unique tags from entries
    - Create filter UI with tag buttons
    - Implement filterByTag() method
    - _Requirements: 6.5_
  
  - [x] 10.3 Add entry card click navigation
    - Attach click handlers to entry cards
    - Navigate to detail pages on click
    - _Requirements: 6.2_
  
  - [x] 10.3.1 Refine metadata typography
    - Use small uppercase font for date and read time
    - Increase letter-spacing
    - Apply text-white/50 color
    - _Requirements: 6.7_
  
  - [x] 10.3.2 Upgrade tag styling
    - Use transparent background with thin border
    - Implement hover effect: white background, black text
    - Add smooth transitions
    - _Requirements: 6.8_
  
  - [x] 10.3.3 Implement borderless list design
    - Remove card backgrounds by default
    - Show only bottom thin line
    - Display glass background only on hover
    - Add padding/margin transitions on hover
    - _Requirements: 6.9, 6.10_
  
  - [ ]* 10.4 Write property test for journal date sorting
    - **Property 15: Journal Entry Date Sorting**
    - **Validates: Requirements 6.1**
  
  - [ ]* 10.5 Write property test for journal navigation
    - **Property 16: Journal Entry Navigation**
    - **Validates: Requirements 6.2**
  
  - [ ]* 10.6 Write property test for tag filtering
    - **Property 18: Journal Tag Filtering**
    - **Validates: Requirements 6.5**
  
  - [ ]* 10.7 Write property test for entry preview completeness
    - **Property 19: Journal Entry Preview Completeness**
    - **Validates: Requirements 6.6**

- [ ] 11. Create journal entry detail page template
  - [x] 11.1 Build journal entry page HTML structure
    - Create template with title, date, content, tags
    - Add "Back to Journal" navigation button
    - _Requirements: 6.3, 6.4_
  
  - [ ]* 11.2 Write property test for journal entry page completeness
    - **Property 17: Journal Entry Page Completeness**
    - **Validates: Requirements 6.3, 6.4**

- [x] 12. Checkpoint - Verify all components
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Build homepage (index.html)
  - [x] 13.1 Create hero section with personal introduction
    - Add prominent heading with website owner name
    - Include tagline/description
    - Add navigation links to main sections
    - Include social media icon buttons
    - Apply entrance animations
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x] 13.2 Integrate project showcase on homepage
    - Add project grid container
    - Initialize ProjectShowcase component
    - Load and display featured projects
    - _Requirements: 4.1_
  
  - [x] 13.3 Add SEO metadata to homepage
    - Include unique title tag
    - Add meta description
    - Add Open Graph tags (og:title, og:description, og:image)
    - _Requirements: 9.1, 9.2, 9.3_

- [ ] 14. Build mood calendar page (calendar.html)
  - [x] 14.1 Create calendar page layout
    - Add page header and navigation
    - Create calendar container
    - Add mood legend section
    - _Requirements: 5.1_
  
  - [x] 14.2 Initialize MoodCalendar component
    - Load mood data
    - Render current month by default
    - Wire up month navigation
    - _Requirements: 5.6_
  
  - [x] 14.3 Add SEO metadata to calendar page
    - Include unique title tag
    - Add meta description
    - Add Open Graph tags
    - _Requirements: 9.1, 9.2, 9.3_

- [ ] 15. Build journal listing page (journal.html)
  - [x] 15.1 Create journal page layout
    - Add page header and navigation
    - Create entries container
    - Add tag filter section
    - _Requirements: 6.1_
  
  - [x] 15.2 Initialize JournalSystem component
    - Load journal entries
    - Render entry preview cards
    - Wire up tag filtering
    - _Requirements: 6.1, 6.5_
  
  - [x] 15.3 Add SEO metadata to journal page
    - Include unique title tag
    - Add meta description
    - Add Open Graph tags
    - _Requirements: 9.1, 9.2, 9.3_

- [ ] 16. Implement responsive design optimizations
  - [x] 16.1 Add mobile-specific styles
    - Ensure touch targets are at least 44x44px
    - Optimize layouts for mobile viewport (< 640px)
    - Test hamburger menu functionality
    - _Requirements: 2.1, 2.5, 8.3_
  
  - [x] 16.2 Add tablet-specific styles
    - Optimize layouts for tablet viewport (640-1024px)
    - _Requirements: 2.2_
  
  - [x] 16.3 Add desktop-specific styles
    - Optimize layouts for desktop viewport (> 1024px)
    - _Requirements: 2.3_
  
  - [ ]* 16.4 Write property test for touch target size
    - **Property 5: Touch Target Minimum Size**
    - **Validates: Requirements 2.5**

- [ ] 17. Implement image optimization
  - [x] 17.1 Add alt attributes to all images
    - Ensure all img elements have descriptive alt text
    - _Requirements: 9.4_
  
  - [x] 17.2 Add lazy loading to below-fold images
    - Add loading="lazy" attribute to images below viewport
    - _Requirements: 10.5_
  
  - [x] 17.3 Prioritize hero image loading
    - Add priority loading to hero section images
    - _Requirements: 9.5_
  
  - [ ]* 17.4 Write property test for image alt attributes
    - **Property 23: Image Alt Attributes**
    - **Validates: Requirements 9.4**
  
  - [ ]* 17.5 Write property test for WebP format usage
    - **Property 24: WebP Image Format Usage**
    - **Validates: Requirements 10.3**
  
  - [ ]* 17.6 Write property test for lazy loading
    - **Property 25: Below-Fold Image Lazy Loading**
    - **Validates: Requirements 10.5**

- [ ] 18. Add SEO metadata to all pages
  - [ ]* 18.1 Write property test for SEO metadata completeness
    - **Property 22: Page SEO Metadata Completeness**
    - **Validates: Requirements 9.1, 9.2, 9.3**

- [ ] 19. Create sample content
  - [x] 19.1 Populate projects.json with sample projects
    - Add at least 3 sample projects with complete data
    - Include thumbnail and screenshot images
    - _Requirements: 4.1_
  
  - [x] 19.2 Populate moods.json with sample mood data
    - Add mood entries for current month
    - Include variety of mood types
    - _Requirements: 5.1_
  
  - [x] 19.3 Populate journal-entries.json with sample entries
    - Add at least 3 sample journal entries
    - Include tags for filtering demonstration
    - _Requirements: 6.1_
  
  - [ ]* 19.4 Write property test for JSON data validity
    - **Property 27: JSON Data Structure Validity**
    - **Validates: Requirements 12.1, 12.2**

- [ ] 20. Final integration and polish
  - [x] 20.1 Wire all components together
    - Ensure navigation works across all pages
    - Verify all links and buttons function correctly
    - Test data loading on all pages
    - _Requirements: 8.1, 8.4_
  
  - [x] 20.2 Apply final visual polish
    - Verify 60-30-10 color distribution
    - Check spacing and breathing room
    - Ensure consistent glassmorphism styling
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 20.3 Test animations and transitions
    - Verify all hover effects work
    - Check scroll animations trigger correctly
    - Ensure smooth scrolling works
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 21. Implement cursor follow glow (动态光影)
  - [ ] 21.1 Create CursorGlow class
    - Implement cursor tracking with mousemove event
    - Create radial gradient glow element
    - Use rgba(139, 92, 246, 0.08) for glow color
    - Ensure glow is subtle and doesn't interfere with readability
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_

- [ ] 22. Implement Bento Grid layout (便当盒布局)
  - [ ] 22.1 Create Bento Grid CSS
    - Implement CSS Grid with irregular layout
    - Define featured project spans (2x1 or 1x2)
    - Ensure responsive behavior
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [ ] 22.2 Update ProjectShowcase to use Bento Grid
    - Modify render method to apply Bento Grid classes
    - Mark featured projects appropriately
    - Test layout balance and alignment
    - _Requirements: 14.1, 14.2, 14.3_

- [ ] 23. Implement gradient border enhancement (边框美学)
  - [ ] 23.1 Create gradient border CSS
    - Implement conic-gradient border effect
    - Use ::before pseudo-element for border
    - Ensure 0.5px visual thickness
    - Add hover enhancement
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_
  
  - [ ] 23.2 Apply gradient borders to glass cards
    - Update .glass-card class with gradient border
    - Test across different card types
    - Verify visual refinement
    - _Requirements: 15.1, 15.5_

- [ ] 24. Implement gradient text effect (排版升级)
  - [ ] 24.1 Create gradient text CSS
    - Implement bg-clip-text gradient
    - Apply to hero section h1
    - Ensure readability and accessibility
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 25. Upgrade to spring physics animations (弹性物理曲线)
  - [ ] 25.1 Replace easing curves globally
    - Update all transitions to use cubic-bezier(0.175, 0.885, 0.32, 1.275)
    - Apply to card hover effects
    - Apply to entrance animations
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ] 26. Implement line reveal animation (遮罩入场)
  - [ ] 26.1 Create LineRevealController class
    - Implement Intersection Observer for line reveals
    - Create CSS for line reveal effect
    - Apply to project card titles and descriptions
    - Add stagger delays for multiple lines
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_

- [ ] 27. Implement seamless page transitions (无缝页面过渡)
  - [ ] 27.1 Create PageTransitionController class
    - Implement document.startViewTransition API support
    - Create fallback fade overlay for unsupported browsers
    - Intercept navigation links
    - Add fade-out and fade-in effects
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [ ] 28. Enhance parallax scrolling (滚动视差增强)
  - [ ] 28.1 Update ParallaxController
    - Implement differential scroll speeds for background/foreground
    - Apply to hero section background grid
    - Use requestAnimationFrame for smooth performance
    - Disable on mobile devices
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5_

- [ ] 29. Implement calendar-journal linking (日历与日志互通)
  - [ ] 29.1 Add journal entry checking to MoodCalendar
    - Implement checkJournalEntry method
    - Update tooltip to show journal link when entry exists
    - Style journal link button
    - Test bidirectional navigation
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_

- [ ] 30. Implement journal mood color indicator (日志心情色标)
  - [ ] 30.1 Add mood color to journal cards
    - Implement getMoodForDate method in JournalSystem
    - Add 2px vertical line with mood color
    - Use neutral gray for dates without mood
    - Add subtle glow effect
    - _Requirements: 22.1, 22.2, 22.3, 22.4, 22.5_

- [ ] 31. Implement mood legend interactive filtering (心情图例交互)
  - [ ] 31.1 Add filtering to mood legend
    - Implement filterByMood method
    - Dim non-matching dates to 20% opacity
    - Add active state to legend buttons
    - Support filter toggling
    - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.5_

- [ ] 32. Implement empty state designs (空状态美化)
  - [ ] 32.1 Create EmptyStateRenderer class
    - Design glassmorphism empty state cards
    - Create variants for journal, mood, and projects
    - Add relevant icons and encouraging text
    - Apply to all content areas
    - _Requirements: 24.1, 24.2, 24.3, 24.4, 24.5_

- [x] 21. Final checkpoint - Complete testing
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples and edge cases
- The implementation follows a component-first approach, building reusable pieces before assembling pages
- All styling follows the Whitefir Studio design guidelines (60-30-10 color principle, glassmorphism, 300ms transitions)
