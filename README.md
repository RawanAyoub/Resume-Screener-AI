# 🎯 Resume Screening AI

A modern React application that analyzes resumes using AI through n8n webhooks.

## ✨ Features

- 📤 Drag & drop file upload (PDF, DOC, DOCX, TXT)
- 🤖 AI-powered resume analysis
- 📊 Detailed scoring with pros/cons/missing skills
- 🌙 Dark/Light theme toggle
- ❄️ Beautiful animated background
- 📱 Fully responsive design

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- n8n instance with OpenAI integration

### Installation

```bash
# Clone and install
git clone <your-repo>
cd resume-screening
npm install

# Setup environment
cp .env.example .env.local
# Add your n8n webhook URL to .env.local
```

### Configuration

Create `.env.local` with your n8n webhook:
```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/resume-screen
```

### Run Development Server

```bash
npm run dev
# Open http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview
```

## 🔧 n8n Workflow Setup

I've included a complete n8n workflow in `/.github/Workflow/Resume-Screening-with-AI.json`.

**To use it:**
1. Open your n8n instance
2. Go to Workflows → Import
3. Drag and drop the JSON file or paste its contents
4. Configure your OpenAI credentials
5. Activate the workflow

The workflow handles:
- ✅ Request validation
- 🔄 Resume processing 
- 🤖 AI analysis with GPT
- 📊 Response formatting

## 🛠️ Tech Stack

- **React 18** + TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Vite** for fast development
- **n8n** for AI workflow automation

## 📋 API Format

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "job_id": "dev-001",
  "job_description": "Looking for a React developer...",
  "resume_file": "base64-encoded-file-content"
}
```

**Response:**
```json
{
  "candidate_info": { "name": "...", "email": "...", "job_id": "..." },
  "screening_result": {
    "ai_score": 85,
    "pros": ["Strong React experience", "..."],
    "cons": ["Limited backend knowledge", "..."], 
    "missing_skills": ["Node.js", "..."],
    "analysis_explanation": "Detailed analysis..."
  }
}
```

## 🧪 Testing

```bash
npm run test          # Run tests
npm run test:watch    # Watch mode
npm run test:e2e      # End-to-end tests
```

## 📦 Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build
- `test` - Run all tests
- `lint` - Check code quality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if needed
5. Submit a pull request

## 📄 License

MIT License