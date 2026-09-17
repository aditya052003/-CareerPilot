# 💼 CareerPilot

### Know Your Gap. Know Your Next Step.

CareerPilot is an AWS-powered job-readiness platform that helps students understand how well their resume matches a target job description.

Instead of simply showing job listings, CareerPilot analyzes the candidate's resume against the requirements of a target role, identifies matching and missing skills, and generates a personalized learning roadmap and interview preparation questions.

---

## 🎯 Problem

Students often apply for jobs without knowing whether their current skills actually match the job requirements.

Traditional job platforms may show:

- Job descriptions
- Required skills
- Job opportunities

But they often do not clearly answer:

> **"What skills am I missing, and what should I learn next?"**

CareerPilot addresses this gap.

---

## 💡 Solution

CareerPilot compares a student's resume with a target job description and provides an easy-to-understand readiness analysis.

### CareerPilot Flow

Resume + Job Description  
↓  
Skill Extraction & Matching  
↓  
📊 Readiness Score  
↓  
✅ Matched Skills  
↓  
❌ Missing Skills  
↓  
🗺️ Personalized Roadmap  
↓  
🎤 Interview Preparation

---

## ✨ Key Features

### 📄 Resume Analysis
Upload your resume in PDF format.

### 💼 Job Description Analysis
Paste the job description for the role you want to target.

### 📊 Readiness Score
Get a percentage-based indication of how closely your demonstrated skills match the target role.

### ✅ Matched Skills
See the skills detected in both your resume and the job requirements.

### ❌ Missing Skills
Identify important skills mentioned in the job description that are not demonstrated in the resume.

### 🗺️ Personalized Roadmap
Get practical learning steps for the missing skills.

### 🎤 Interview Preparation
Practice technical interview questions related to your identified skill gaps.

---

# ☁️ AWS Architecture

```text
                    ┌─────────────────────┐
                    │   CareerPilot UI    │
                    │    React + Vite     │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   AWS Amplify       │
                    │  Frontend Hosting   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    API Gateway      │
                    │    POST /analyze    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    AWS Lambda       │
                    │ careerpilot-analyze │
                    └──────┬────────┬─────┘
                           │        │
                 ┌─────────┘        └─────────┐
                 ▼                            ▼
        ┌─────────────────┐          ┌──────────────────┐
        │   Amazon S3     │          │    DynamoDB      │
        │ Resume Storage  │          │ Analysis Results │
        └─────────────────┘          └──────────────────┘

☁️ AWS Services Used
AWS Service	Purpose
AWS Amplify	Hosts and deploys the React frontend
Amazon API Gateway	Provides the /analyze HTTP API
AWS Lambda	Processes resumes and performs analysis
Amazon S3	Stores uploaded PDF resumes
Amazon DynamoDB	Stores analysis results
Amazon Bedrock	Planned AI enhancement for intelligent analysis
🔄 How It Works
1. Upload Resume

The user uploads a PDF resume through the CareerPilot interface.

2. Enter Target Job

The user pastes the job description for the role they want to apply for.

3. Analyze

The frontend sends the resume and job description to:

API Gateway → AWS Lambda
4. Resume Storage

Lambda stores the uploaded resume in:

Amazon S3
5. Skill Analysis

Lambda extracts text from the resume and compares demonstrated skills with the skills required by the job description.

6. Results

CareerPilot generates:

Readiness Score
Matched Skills
Missing Skills
Skill Gap Explanation
Personalized Roadmap
Interview Questions
7. Data Storage

The analysis result is stored in:

Amazon DynamoDB
🛠️ Tech Stack
Frontend
React
JavaScript
Vite
HTML
CSS
Backend
Node.js
AWS Lambda
API Gateway
Cloud
AWS Amplify
Amazon S3
Amazon DynamoDB
Amazon Bedrock
Development Tools
VS Code
Git
GitHub
npm
🚀 Live Demo

Try CareerPilot here:

https://main.d2b1izskd77gfm.amplifyapp.com

📁 Project Structure
CareerPilot/
│
├── backend/
│   ├── server.js
│   └── package.json
│
├── lambda/
│   ├── index.mjs
│   └── package.json
│
├── public/
│
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
│
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
🎯 Example

A candidate may receive an analysis such as:

Readiness Score: 88%

Matched Skills:
✓ JavaScript
✓ React
✓ Node.js
✓ Express
✓ MongoDB
✓ SQL
✓ Python
✓ Java
✓ Git
✓ GitHub
✓ HTML
✓ CSS
✓ REST API
✓ API

Missing Skills:
✗ AWS
✗ Docker

CareerPilot then converts these gaps into actionable steps.

AWS Roadmap
Learn AWS fundamentals
Learn EC2 and S3
Learn Lambda and API Gateway
Build a small AWS project
Docker Roadmap
Learn Docker basics
Learn images and containers
Dockerize a Node.js application
🏆 Hackathon Focus

CareerPilot focuses on solving a practical problem faced by students and early-career developers:

Knowing what to learn before applying for a job.

The project demonstrates how AWS cloud services can be combined to create a scalable job-readiness platform.

🔮 Future Improvements

Planned improvements include:

AI-powered analysis using Amazon Bedrock
More advanced resume understanding
Semantic matching between resumes and job descriptions
Personalized interview preparation
Improved skill recommendations
Support for additional resume formats
Authentication and personalized user profiles        

👨‍💻 Built With

Built as an AWS-based hackathon project using React, Node.js and AWS cloud services.

CareerPilot — Know Your Gap. Know Your Next Step.