# Animastery AI Project

## Overview
A 2D animation and character design system combining style visualization, character sprite generation, and animation capabilities. Helps animators create detailed character sprites with various animations and poses.

## Current Status: In Development

### What's Built

**Backend (Python + FastAPI) - `animastery-ai/backend/`**
- `main.py` - FastAPI server
- `ai/rag_pipeline.py` - RAG pipeline for AI features
- `data/animastery_knowledge.txt` - Knowledge base

**Frontend (React + TypeScript) - `animastery-ai/frontend/`**
- React app with TypeScript
- Theme toggle component
- Standard Create React App structure

**Launcher Scripts:**
- `start_backend.bat` - Launch backend server
- `start_frontend.bat` - Launch frontend dev server
- `animastery-ai/start_servers.ps1` - PowerShell combined launcher

### Features
- Character Sprite Generator (customizable designs, expressions, weapons)
- Animation System (idle, attack states, frame transitions)
- Style Visualization (7 animation style presets)

### Characters
- **Aaron** - Red-themed, scythe weapon
- **Mani** - Blue-themed, energy blade weapon

---

## Notes for Future Sessions

### Known Issues / TODO
- [ ] Verify backend/frontend connection
- [ ] Test RAG pipeline functionality
- [ ] Add more animation states

### Last Session Context
<!-- Update this section each session -->
- Date: 2026-01-13
- Status: Project review
- Next: User to specify what to work on

---

## Quick Reference

**To Run:**
```bash
# Backend
cd animastery-ai/animastery-ai/backend
python main.py

# Frontend
cd animastery-ai/animastery-ai/frontend
npm start
```

**Tech Stack:**
- Backend: Python, FastAPI
- Frontend: React, TypeScript
- AI: RAG pipeline with local knowledge base
