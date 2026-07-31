# CivicLens

<p align="center">
  <h3 align="center">Turning Civic Problems into Action with AI</h3>
  <p align="center">
    An AI-powered smart civic issue reporting and prioritization platform that helps citizens report infrastructure defects while enabling authorities to detect, prioritize, and resolve them efficiently.
  </p>
</p>

---

## 📖 Overview

CivicLens is an AI-powered civic issue management platform designed to modernize how infrastructure problems such as potholes, flooding, fallen trees, and garbage accumulation are reported and resolved.

Instead of requiring citizens to identify the correct government department, CivicLens automatically detects the issue using Artificial Intelligence, evaluates its severity, identifies duplicate reports, assigns a priority level, and routes it to the appropriate authority.

The platform combines computer vision, semantic image similarity, intelligent prioritization, and an interactive dashboard to create a transparent bridge between citizens and government agencies.

---

# 🚨 Problem Statement

Current civic complaint systems suffer from several challenges:

- Lengthy and confusing complaint procedures
- Citizens often don't know the correct department to contact
- Duplicate reports waste administrative resources
- No intelligent prioritization of complaints
- Limited transparency after a complaint is submitted
- Delayed response to critical public safety issues

These challenges often result in delayed repairs, inefficient resource allocation, and reduced public trust.

---

# 💡 Our Solution

CivicLens simplifies civic issue reporting by allowing users to submit a photo of an issue.

The platform automatically:

- Detects the civic issue using AI
- Identifies duplicate complaints
- Assesses severity
- Calculates complaint priority
- Routes the issue to the correct department
- Enables authorities to monitor and update complaint status

---

# ✨ Features

## Citizen Features

- AI-powered issue detection
- Simple photo-based reporting
- Automatic GPS location capture
- Community issue map
- Complaint status tracking
- AI-powered chatbot assistant

## Authority Features

- Department dashboard
- Priority-based complaint queue
- Duplicate complaint merging
- Complaint verification
- Complaint lifecycle management
- Analytics dashboard

---

# 🛣️ Supported Civic Issues

- 🛣️ Potholes
- 🌊 Flooding
- 🌳 Fallen Trees
- 🗑️ Garbage Accumulation

---

# 🧠 AI Pipeline

```text
Citizen Uploads Image
        │
        ▼
YOLO11n Detection
        │
        ▼
Highest Confidence Detection
        │
        ▼
Generate CLIP Embedding
        │
        ▼
Duplicate Detection
        │
   ┌───────────────┐
   │ Duplicate?    │
   └──────┬────────┘
          │
     Yes  │  No
          ▼
Increase Report Count
Recalculate Priority
          │
          ▼
 Gemini Severity Analysis
          │
          ▼
 Department Routing
          │
          ▼
 Save to Supabase
```

---

# ⚙️ System Architecture

```text
                Next.js Frontend
                       │
                       ▼
                 FastAPI Backend
                       │
        ┌──────────────┼──────────────┐
        │              │              │
     YOLO11n        CLIP         Gemini
   Detection     Embeddings     Severity
        │              │              │
        └──────────────┼──────────────┘
                       │
                  Supabase
                       │
              Admin Dashboard
```

---

# 🛠️ Technology Stack

## Frontend

- Next.js
- TypeScript
- Tailwind CSS

## Backend

- FastAPI
- Python

## AI / Machine Learning

- YOLO11n Segmentation
- CLIP Embeddings
- Gemini
- Groq (AI Chatbot)

## Database & Storage

- Supabase PostgreSQL
- Supabase Storage
- Supabase Authentication

## Maps

- OpenStreetMap

## Deployment

- Vercel
- Cloudflare Tunnel

---

# 🔍 AI Model Training

### Object Detection

- Model: YOLO11n Segmentation
- Training Platform: Google Colab
- GPU: NVIDIA T4
- Epochs: 50
- Image Size: 640 × 640

### Dataset

- Combined multiple Roboflow Universe datasets
- Total Images: ~15k+
- Categories:
  - Potholes
  - Flooding
  - Fallen Trees
  - Garbage

---

# 📊 Model Performance

| Metric | Value |
|---------|------:|
| mAP@50 | 0.609 |
| mAP@50-95 | 0.529 |

---

# 🔁 Duplicate Detection

To reduce redundant complaints, CivicLens generates CLIP embeddings for every submitted image.

The system compares:

- Visual similarity
- Geographic proximity

If a matching complaint is found:

- Report count is incremented
- Priority score is updated
- No duplicate complaint is created

---

# 🚦 Complaint Workflow

```text
Submitted
      │
      ▼
Verified
      │
      ▼
Assigned
      │
      ▼
Resolved
```

---

# 🌐 API Endpoints

## Health

- GET `/health`
- GET `/ready`

## Inference

- POST `/infer`

## Reports

- POST `/process-report`
- POST `/similar-reports`
- GET `/complaints`

---

# 📈 Dashboard

Authorities can:

- View all complaints
- View complaint locations
- Track complaint status
- Prioritize complaints
- Monitor department-wise reports
- View complaint images

---

# 🚀 Deployment

| Component | Platform |
|-----------|----------|
| Frontend | Vercel |
| Backend | FastAPI |
| Database | Supabase |
| Storage | Supabase Storage |
| API Tunnel | Cloudflare Tunnel |

---

# 📌 Future Scope

- Government API Integration
- Mobile Application
- WhatsApp Reporting
- Voice-based Reporting
- Push Notifications
- Multilingual Support
- CCTV Integration
- Drone-based Monitoring
- Predictive Maintenance
- Smart City Integration

---

# ⚠️ Current Limitations

- Supports only four civic issue categories
- Government API integration is planned
- Priority scoring can be further enhanced using richer contextual information

---

# 👥 Team

### Abin Antony
**AI/ML Integration, Backend Architecture & Deployment**

- AI pipeline
- FastAPI backend
- CLIP embedding integration
- Deployment
- Supabase integration

---

### Augusto Patrick
**Model Training & Documentation**

- Dataset preparation
- YOLO11n training
- Model optimization
- Technical documentation
- AI/ML workflow documentation

---

### Dennis Sabu
**Frontend Development & Platform Integration**

- Next.js frontend
- UI/UX Design
- Dashboard
- Community Map
- AI Chatbot
- Platform integration

---

# 🌟 Vision

Our vision is to create a unified AI-powered bridge between citizens and government authorities.

Rather than requiring citizens to identify the appropriate department or complaint portal, CivicLens intelligently detects civic issues, evaluates their severity, removes duplicate reports, prioritizes them, and routes them to the appropriate authority.

By combining computer vision, semantic similarity search, intelligent prioritization, and transparent tracking, CivicLens aims to improve public infrastructure management while enabling faster and more accountable civic governance.

---

## 📄 License

This project was developed as part of a hackathon/research initiative and is intended for educational and demonstration purposes.

## Links
Google Collab: https://colab.research.google.com/drive/1UqcqBbEUP54RXrlwOLBoYwxeeeWJxZrA?usp=sharing&authuser=1#scrollTo=lzhQKKUIoHM0

Notion: https://app.notion.com/p/CivicLens-3ae4454561198036b4abd180154e0229?source=copy_link
