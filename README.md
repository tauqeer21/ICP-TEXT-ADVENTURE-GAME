# 🚀 USS Phoenix: Interactive Spaceship Adventure

An immersive **text-based space adventure game** built with React, where you command the USS Phoenix research vessel through a catastrophic AI malfunction. Navigate through 16 detailed ship compartments, collect critical equipment, and restore ship systems before life support fails!

![Game Screenshot](https://img.shields.io/badge/React-18.2-blue) ![Status](https://img.shields.io/badge/Status-Hackathon%20Ready-success) ![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 Game Features

### Core Gameplay
- **16 Interactive Ship Compartments** - Fully explorable spaceship with detailed rooms
- **Smart Navigation System** - Move through the ship using directional commands (north/south/east/west)
- **Interactive Ship Map** - Visual representation of the ship layout with clickable rooms
- **Inventory Management** - Collect and use critical equipment and access codes
- **Progressive Unlocking** - Room access based on collected items and story progression
- **Mission-Critical Objectives** - Restore AI systems and save the ship

### Advanced Features
- **Real-time Status Monitoring** - Track oxygen levels, power systems, and crew health
- **Achievement System** - Unlock achievements for exploration and problem-solving
- **Mobile Responsive Design** - Optimized for both desktop and mobile devices
- **Voice Input Support** - Speak commands instead of typing (optional)
- **Advanced Visual Effects** - Matrix-style background animations and terminal effects
- **Character Customization** - Personalize your commander profile
- **Mini-Game Integration** - Interactive repair puzzles and system diagnostics

## 🛠 Technology Stack

### Frontend
- **React 18.2+** - Modern React with Hooks and functional components
- **Framer Motion** - Smooth animations and transitions
- **JavaScript ES6+** - Modern JavaScript features
- **CSS3** - Custom styling with gradients and animations
- **SVG Graphics** - Interactive ship map and visual elements

### Architecture
- **Component-Based Design** - Modular and reusable React components
- **State Management** - React Hooks for complex game state
- **Event-Driven System** - Command processing and game logic
- **Responsive Grid Layout** - Adaptive UI for different screen sizes

## 🚀 Quick Start

### Prerequisites

Node.js 16.0+ 

npm or yarn package manager

### Installation

# Clone the repository
git clone https://github.com/yourusername/uss-phoenix-adventure.git
cd uss-phoenix-adventure

# Install the DFX
DFX SDK 0.29.0+ (Internet Computer development environment) coammand for Install DFX= sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"

# Start the Internet Computer local network
dfx start --clean

# Deploy the backend canisters
dfx deploy backend

# Navigate to frontend directory
cd src/frontend

# Install dependencies
npm install

# Start development server
npm run dev

Navigate to `http://localhost:3000` and begin your space adventure!

## 🎯 How to Play

### Basic Commands
- `look` - Examine your current location
- `go [direction]` - Move through the ship (north, south, east, west)
- `take [item]` - Pick up equipment and access codes
- `use [item]` - Activate devices and unlock systems
- `inventory` - Check your carried equipment
- `status` - View your mission status and ship systems
- `help` - Show all available commands
- `guide` - Open the comprehensive operations manual

### Game Objectives
1. **Explore the Ship** - Navigate through all 16 compartments
2. **Collect Equipment** - Gather critical tools and access codes
3. **Unlock Systems** - Use collected items to access restricted areas
4. **Reach the AI Core** - Navigate to the ship's central computer
5. **Restore Ship Functions** - Complete the repair sequence and save the crew

### Ship Layout

Communications - Bridge - Navigation
| | |
Engineering - MainCorridor - Laboratory
| | |
CargoHold - AiCore - MedicalBay
| | |
Armory - CrewQuarters - Recreation
| | |
LifeSupport - CommandCenter - ObservationDeck


## 🏗 Project Structure

src/
├── App.jsx # Main game component and logic
├── components/
│ ├── Terminal.jsx # Terminal interface component
│ ├── StatusPanel.jsx # Ship and crew status display
│ ├── InteractiveShipMap.jsx # Clickable ship navigation
│ ├── GuideBook.jsx # Help and tutorial system
│ ├── AudioManager.jsx # Sound effects management
│ ├── AchievementSystem.jsx # Game achievements
│ ├── MobileControls.jsx # Mobile-friendly controls
│ ├── SmartCommandInput.jsx # Advanced command input
│ └── AdvancedVisualEffects.jsx # Background effects
├── styles/
└── assets/



## ✨ Key Features Breakdown

### 🗺 Interactive Ship Map
- **Visual Navigation** - Click rooms to move instantly
- **Real-time Updates** - Shows visited areas and current location  
- **Lock Indicators** - Visual cues for inaccessible areas
- **Hover Information** - Room details and status on mouse-over

### 💻 Smart Terminal Interface
- **Command History** - Arrow keys navigate previous commands
- **Auto-completion** - Intelligent command suggestions
- **Real-time Feedback** - Immediate response to player actions
- **Status Integration** - Live updates of game state

### 📱 Mobile Optimization  
- **Touch Controls** - Optimized button layout for mobile
- **Responsive Design** - Adapts to different screen sizes
- **Gesture Support** - Swipe and tap interactions
- **Battery Efficient** - Optimized rendering for mobile devices

## 🎨 Screenshots

### Desktop Interface
![Desktop View](https://via.placeholder.com/800x400/0a0a0a/00ffff?text=Desktop+Game+Interface)

### Mobile Interface  
![Mobile View](https://via.placeholder.com/400x600/0a0a0a/ff6666?text=Mobile+Game+Interface)

### Ship Map
![Ship Map](https://via.placeholder.com/600x400/0a0a0a/ffaa33?text=Interactive+Ship+Map)

## 🏆 Hackathon Highlights

### Innovation Points
- **Immersive Storytelling** - Rich narrative with branching possibilities
- **Technical Excellence** - Modern React architecture with advanced state management
- **User Experience** - Intuitive interface design with multiple interaction methods
- **Cross-Platform** - Works seamlessly on desktop, tablet, and mobile
- **Extensible Design** - Modular architecture for easy feature additions

### Problem Solving
- **Complex Navigation Logic** - Implemented proper directional movement system
- **State Management** - Efficient handling of game progression and inventory
- **Responsive Design** - Single codebase supporting multiple device types
- **Performance Optimization** - Smooth animations without performance impact

## 🔧 Development & Deployment

### Development Commands
