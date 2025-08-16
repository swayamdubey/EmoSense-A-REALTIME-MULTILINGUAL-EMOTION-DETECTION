# 🎤EmoSense: A Real-Time Multilingual Emotion Detection from Speech Signals

## 📌 Overview
This project is a real-time emotion detection system that analyzes emotions from voice inputs using a combination of Flask (Python) and Node.js for backend processing, and React.js for frontend visualization. It supports multilingual speech, automatically transcribes and translates audio, and classifies emotions using a Distillbert-based transformer model.

---

![WhatsApp Image 2025-06-09 at 00 38 47_b0e10af0](https://github.com/user-attachments/assets/5f9b1090-1838-46ba-91ec-e3dffaeb63e8)
Dashboard

![WhatsApp Image 2025-06-09 at 00 40 00_348d3b89](https://github.com/user-attachments/assets/a955254e-8e1b-4371-bfea-be769d0416f9)
start recording


![WhatsApp Image 2025-06-09 at 00 40 55_71811df5](https://github.com/user-attachments/assets/c94aae86-23ce-4fdb-83a1-3daa09b94bbb)
analyse recording

![WhatsApp Image 2025-06-09 at 00 44 32_9a826913](https://github.com/user-attachments/assets/de47f140-b79c-4cb7-ad6b-5c37260eadcf)
Results

## 🚀 Key Features
- 🎙 **Speech-to-Text**: Converts recorded audio into text using Google Speech Recognition.
- 🌍 **Multilingual Translation**: Detects and translates non-English text to English via Google Translate API.
- 🤖 **Emotion Detection**: Utilizes the `Distillbert-base-go_emotions` model for accurate emotion classification with confidence scores.
- 🖥 **Interactive Dashboard**: Real-time visualization of detected emotions in a responsive UI and changes background colour based on emotion.
- ⚡ **Instant Feedback**: Uploads and processes audio with near real-time response.

---

## 🛠 Tech Stack
- **Backend**: Flask (Python), Node.js (Express), Google Speech Recognition, Google Translate API, Hugging Face Transformers
- **Frontend**: React.js, Tailwind CSS, TypeScript
- **Deployment**: Modular architecture — Flask (emotion analysis), Node.js (API routing), React (UI)

---

## 📁 Project Structure
```bash
Emotion-Detection-Voice/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── index.js
│   ├── flask_api/
│   │   └── emotion.py
│   ├── uploads/
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   └── package.json
├── README.md
└── .gitignore

