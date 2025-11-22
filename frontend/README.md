Project Description

This project is a simple full-stack web application that allows a user to:

Upload a PDF document (2–10 pages)

Enter 3 custom rules the document must satisfy

Check the PDF using an LLM, which evaluates each rule and returns:

PASS / FAIL

One evidence sentence found in the PDF

Short reasoning

Confidence score (0–100)

The goal is to simulate an AI-assisted document checker that analyzes a PDF based on natural-language rules.

🛠️ Tech Stack Used
Frontend

HTML / CSS / React

File upload UI

Table for displaying LLM results

Backend

Node.js + Express or Python (Flask/FastAPI)

PDF text extraction library

LLM API (OpenAI / Gemini / Claude — any model allowed)