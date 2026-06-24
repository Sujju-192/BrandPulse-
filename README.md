# 🚀 CodeCollab
### From Solo Coding to Real-Time AI Collaboration – Powered by Intelligent Development Tools

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/Monaco-Editor-007ACC?logo=visualstudiocode&logoColor=white" alt="Monaco" />
  <img src="https://img.shields.io/badge/WebRTC-Peer--to--Peer-333333?logo=webrtc&logoColor=white" alt="WebRTC" />
  <img src="https://img.shields.io/badge/Yjs-CRDT-FF6C2C" alt="Yjs" />
  <img src="https://img.shields.io/badge/Gemini-AI-8E75B2" alt="Gemini" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Liveblocks-Collaboration-000000" alt="Liveblocks" />
</p>

---

## 📌 Overview

CodeCollab is an **AI-powered collaborative development platform** designed to make coding, interviewing, learning, and team collaboration seamless.

Traditional coding collaboration usually requires multiple disconnected tools:

- Code editor
- Video calls
- Documentation websites
- Whiteboard applications
- Code execution platforms
- AI assistants

This creates interruptions and context switching.

CodeCollab solves this by combining everything into **one unified workspace** where users can:

- Write code together in real time
- Ask AI for help
- Run programs instantly
- Draw architecture diagrams
- Learn concepts
- Share rooms instantly

Create a room → Share link → Start coding.

---

## 🌟 Why CodeCollab?

- 🔄 **Real-Time Multiplayer Editing**
- 🤖 **AI Integrated Inside Development Workflow**
- ⚡ **Instant Multi-Language Code Execution**
- 📚 **Interactive Learning Hub**
- 🎨 **Collaborative Whiteboard**
- 🔗 **One Click Shareable Rooms**
- 🔒 **No Account Required**

---

# 📷 Application Preview

### 🏠 Landing Page

![Landing](./screenshots/landing.png)

---

### 💻 Collaborative Editor

![Editor](./screenshots/editor.png)

---

### 🤖 AI Coding Assistant

![AI Assistant](./screenshots/ai-panel.png)

---

### 👥 Live Collaboration & Multi-Cursor Support

![Collaboration](./screenshots/collaboration.png)

---

### 📚 Interactive Documentation Hub

![Documentation](./screenshots/documentation.png)

---

### 🎨 Collaborative Whiteboard

![Whiteboard](./screenshots/whiteboard.png)

---

# 🎥 Demo

Experience CodeCollab live:

🔗 **[Launch App](YOUR_DEPLOYMENT_LINK)**

Watch walkthrough:

🎬 **[Watch Demo](YOUR_VIDEO_LINK)**

---

## ✨ Core Features

| Feature | Description | Powered By |
|----------|-------------|-------------|
| 🔄 **Real-Time Collaboration** | Multi-user code editing, cursor synchronization, room collaboration | Yjs + WebRTC |
| 🤖 **AI Coding Assistant** | Code generation, debugging, explanations, optimization | Gemini + AI Models |
| ⚡ **Instant Code Execution** | Execute multiple programming languages directly | Piston API |
| 📚 **Learning Hub** | Interactive documentation and examples | React |
| 🎨 **Collaborative Whiteboard** | Draw diagrams and brainstorm ideas | Whiteboard + AI |
| 🔗 **Room Sharing** | Instant room creation and sharing | Liveblocks |
| 🔒 **Private Collaboration** | Peer-to-peer synchronization without storing code | WebRTC |

---

# 🏗 System Architecture

![Architecture](./screenshots/architecture.png)

---

### ⚖️ Traditional Workflow vs CodeCollab

![Comparison](./screenshots/comparison.png)

---

### High-Level Flow

```text
User
   │
   ▼
React + Vite Frontend
   │
   ├── Monaco Editor
   ├── Collaboration Layer
   ├── AI Assistant
   ├── Whiteboard
   └── Learning Hub
          │
          ▼
Node.js + Express Backend
          │
          ├── WebSocket Signaling
          ├── Collaboration Services
          └── AI Request Handling
                   │
                   ▼
External APIs
          │
          ├── Gemini AI
          ├── Piston API
          └── Liveblocks
```

---

## ⚙️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- Monaco Editor
- Framer Motion
- React Hot Toast

### Collaboration Layer

- Yjs (CRDT)
- WebRTC
- Liveblocks

### Backend

- Node.js
- Express
- WebSocket
- dotenv

### AI Integration

- Google Gemini
- Multiple AI Models

### Execution Engine

- Piston API
- Browser JavaScript Sandbox

---

## 📂 Project Structure

```text
CodeCollab/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── public/
│
├── server/
│   ├── routes/
│   ├── services/
│   ├── websocket/
│   └── server.js
│
└── README.md
```

---

## 📈 Challenges Solved

### Real-Time Synchronization

Implemented CRDT-based synchronization using Yjs to ensure:

- Conflict-free editing
- Live updates
- Multi-user collaboration

---

### AI Context Handling

Designed an AI workflow capable of:

- Understanding editor content
- Providing contextual responses
- Generating meaningful suggestions

---

### Execution Pipeline

Implemented:

- Browser-side execution
- External runtime execution
- Multiple language support

---

### User Experience Improvements

Added:

- Live cursor tracking
- Notifications
- Smooth transitions
- Responsive layouts

---

## 🚀 Installation & Local Setup

### Clone Repository

```bash
git clone https://github.com/yourusername/CodeCollab.git

cd CodeCollab
```

---

## Backend Setup

Move into backend:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create:

```bash
server/.env
```

Add:

```env
GITHUB_TOKEN=your_github_token

AI_ENABLED=true

GEMINI_API_KEY=your_gemini_key
```

Run backend:

```bash
npm run dev
```

Backend runs on:

```bash
http://localhost:3000
```

---

## Frontend Setup

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create:

```bash
client/.env
```

Add:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## ▶️ Running Application

Start backend:

```bash
cd server
npm run dev
```

Open new terminal:

```bash
cd client
npm run dev
```

Open browser:

```bash
http://localhost:5173
```

---

## 📚 Learning Hub

Interactive programming guides included:

### JavaScript

- ES6+
- Async/Await
- DOM Manipulation

### Python

- Functions
- OOP
- Libraries

### Java

- Collections
- Multithreading

### C++

- STL
- Memory Management

### C

- Pointers
- File Handling

---

## 🔮 Future Enhancements

- Authentication and room history
- Video and voice collaboration
- Multi-file support
- AI-generated unit tests
- Cloud project storage
- Deployment support
- Community snippets and templates
- Team workspaces

---

<p align="center">

Built for developers who want collaboration and AI in a single workspace.

Happy Coding 🚀

</p>
