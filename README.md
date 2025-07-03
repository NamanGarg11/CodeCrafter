# 🚀 CodeCrafter – AI-Powered Website Builder

CodeCrafter is a lightweight, AI-assisted website/code generator platform that allows users to craft frontend projects by describing what they want in natural language. The system generates step-by-step build instructions, creates project files in a virtual file system, and offers a live code preview experience — all inside the browser!

---
## 🧠 Overview

CodeCrafter enables developers to:
- Enter a simple prompt (e.g., “Build a simple React-based todo app”)
- Watch as the AI breaks down the task into logical steps
- View files being created/modified live
- Edit/view code directly
- Preview the project inside a browser—all in one interface

---

## ✨ Features

- 🧠 **LLM-Powered Workflow**: Prompt the assistant to build or refine your website idea.
- 📁 **File Explorer UI**: Browse, preview, and select any generated file/folder.
- 💻 **Live Code Editor**: Edit and inspect generated code on the fly.
- 🌐 **Instant Preview**: See the live result of your code using WebContainers.
- 🔁 **Refinement Support**: Give additional prompts to tweak or extend the project.
- 📦 **Web-Based Filesystem**: Uses WebContainers to simulate a real dev environment in the browser.
- 🏠 **Navigation**: Home button with a logo for quick navigation.

---

## 🧩 Tech Stack

| Category        | Tool / Library                         |
|----------------|----------------------------------------|
| Frontend       | React, TypeScript, TailwindCSS         |
| Editor         | Monaco Editor                          |
| Virtual FS     | WebContainers by StackBlitz            |
| Backend (API)  | Node.js + Express                      |
| LLM Provider   | Google Gemini (via Generative AI SDK)  |
| XML Parser     | Custom XML-to-Step parser (`parseXml`) |
| Styling        | TailwindCSS + Custom Components        |

---

## 🧠 Workflow

1. **Prompt Input**:  
   The user enters a natural language prompt like *"Build a simple todo app using React"*.

2. **Template Setup**:  
   The backend processes the initial request and provides a base UI + steps.

3. **LLM Response**:  
   It sends structured XML-like steps (e.g. `<create-file>`, `<run-command>`), which are parsed into actionable instructions.

4. **File Generation**:  
   Files/folders are rendered in a nested explorer view, and files are injected with content.

5. **Mount to WebContainer**:  
   The entire structure is mounted to a simulated Node.js dev environment in-browser.

6. **Live Preview**:  
   Switch to "Preview" tab to view the live result inside an iframe powered by WebContainers.

7. **Prompt Refinement**:  
   Users can refine the project (e.g., *"Add a navbar"*) and new steps are added dynamically.

---

## 📂 Project Structure

```
CODECRAFTER/
├── Backend/
│ ├── dist/
│ ├── node_modules/
│ ├── src/
│ │ └── defaults/
│ │ ├── node.ts
│ │ ├── react.ts
│ │ ├── constants.ts
│ │ ├── index.ts
│ │ ├── prompt.ts
│ │ └── stripindents.ts
│ ├── .env
│ ├── .env.example
│ ├── package.json
│ └── tsconfig.json
│
├── frontend/
│ ├── node_modules/
│ ├── src/
│ ├── index.html
│ ├── tailwind.config.js
│ ├── vite.config.ts
│ └── tsconfig.{json, app.json, node.json}
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/NamanGarg11/CodeCrafter.git
cd codecrafter
```

### 2. Install dependencies

```bash
# For frontend
cd frontend
npm install

# For backend
cd ../backend
npm install
```

### 3. Add your environment variables

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Run locally

```bash
# Backend
cd backend
npm run dev

# Frontend
cd ../frontend
npm run dev
```

---

## 📸 UI Preview
![image](https://github.com/user-attachments/assets/c3c66bcb-61c5-4590-a402-d17cee90b1cc)


| Build Steps UI | File Explorer | Live Preview |
|----------------|---------------|--------------|
| ✅ Step-wise list with icons | 📁 Nested folders & files | 🌐 Instant preview inside iframe |

---

## 🧪 Future Improvements

- ✅ Drag and drop files/folders in the explorer
- ✨ Live editing with auto-preview reload
- 🛠️ AI model switching (Gemini, OpenAI, Claude)
- 🌍 Deploy to Vercel/Netlify in one-click

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

📎 Related Projects

-  Boult.new — Generate beautiful portfolio sites with AI in seconds.
-  StackBlitz WebContainers — Server-side runtime inside browser.
- [Google Generative AI SDK](https://github.com/google/generative-ai-js)

---

## 🙌 Acknowledgements

Special thanks to:
- Google Gemini for the powerful generation
- StackBlitz team for enabling the WebContainer tech
- React & TailwindCSS community

---

## 🧠 Inspiration

> “Another day of exploring the world of AI meets frontend development. I built **CodeCrafter** as a minimal, yet powerful tool that transforms your thoughts into interactive web applications — all in your browser.”

---
📜 License

MIT License © 2025 [Naman Garg]
