# Interactive Wall Calendar Component

> A beautifully designed, fully-functional calendar component built with React and Next.js. Featuring interactive date range selection, integrated notes, and responsive design.

![Status](https://img.shields.io/badge/status-production-brightgreen.svg) ![React](https://img.shields.io/badge/React-19-blue.svg) ![Next.js](https://img.shields.io/badge/Next.js-16-black.svg) ![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg) ![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-3.4-purple.svg)

## ✨ Features

- **🎨 Wall Calendar Aesthetic** - Clean, professional design inspired by physical calendars
- **📅 Date Range Selection** - Intuitive click-to-select start and end dates with visual feedback
- **📝 Integrated Notes** - Add general notes or date-specific notes with persistent storage  
- **📱 Fully Responsive** - Seamlessly adapts from mobile to desktop
- **🖼️ Custom Images** - Upload personalized hero images
- **💾 Local Storage** - All data persists without backend
- **⚡ High Performance** - Optimized with React hooks
- **♿ Accessible** - Keyboard navigation, semantic HTML

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17 or later

### Installation

```bash
git clone <your-repo-url>
cd interactive-calendar
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Architecture

### Clean Separation of Concerns

**Business Logic (Hooks):**
- `useCalendar()` - Date calculations
- `useRangeSelection()` - Selection logic  
- `useLocalStorage()` - Persistence

**UI Components:**
- `Calendar` - Orchestrator
- `DateGrid` - Calendar display
- `NotesSection` - Notes UI
- `HeroImage` - Image display

### Design Philosophy
- Single Responsibility Principle
- TypeScript for type safety
- No Redux needed - hooks are sufficient
- Memoization for performance

## 📖 How to Use

1. **Select Dates** - Click two dates to create a range
2. **Add Notes** - Write and save notes (general or date-specific)
3. **Upload Images** - Click "📸 Change Image" to personalize
4. **Navigate** - Use arrows to change months, "Today" to return

## 🛠️ Tech Stack

- React 19
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Responsive Design

## 📊 Performance

- Small bundle (~45KB gzipped)
- Optimized renders
- Fast image loading
- No external dependencies

## ♿ Accessibility

- Full keyboard navigation
- ARIA labels
- Semantic HTML
- High contrast colors
- Touch-friendly

## 📱 Responsive

Works perfectly on mobile, tablet, and desktop.

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### GitHub Pages / Netlify
Connect your GitHub repo for automatic deployments.

## 📹 Video Demo

[Link to demonstration video]

---

**Built with ❤️ for TakeUForward Frontend Engineering Challenge**
