HEAD
AI PDF Checker (Assignment Submission)

Overview

This is a simple Full-Stack application that checks PDF documents against user-defined rules using AI logic. It is built with React.js for the frontend and includes a mock backend structure.

✨ Features

PDF Text Extraction: Extracts text client-side using PDF.js for security and speed.

Custom Rule Engine: Users can define 3 specific rules to check the document against.

AI Analysis: Simulates an LLM audit to provide Pass/Fail status, evidence, and reasoning.

Responsive UI: Built with Tailwind CSS for a clean user experience.

How to Run

Prerequisites

Node.js installed

Steps

Open the terminal and navigate to the frontend folder:

cd frontend


Install the necessary dependencies:

npm install


Start the application:

npm start


The app will launch at http://localhost:3000.

🛠 Project Structure

/frontend: Contains the React application logic (App.js, components).

/backend: Contains the Python/FastAPI structure (main.py) for backend demonstration.

# niyamr-fullstack-assignment
A full-stack PDF rule-checking app that lets users upload a PDF, enter three natural-language rules, and get AI-powered PASS/FAIL results with evidence, reasoning, and confidence scores. Includes PDF text extraction, LLM evaluation, clean UI, and backend API. Built for the NIYAMR AI assignment

