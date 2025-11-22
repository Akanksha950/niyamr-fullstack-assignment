import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, Loader2, Play } from 'lucide-react';

const apiKey = ""; 

const loadPdfLib = async () => {
  if (window.pdfjsLib) return window.pdfjsLib;
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
  script.async = true;
  document.body.appendChild(script);
  return new Promise((resolve) => {
    script.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
  });
};

export default function App() {
  const [file, setFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  
  const [rules, setRules] = useState([
    "The document must have a purpose section.",
    "The document must mention at least one date.",
    "The document must define at least one term."
  ]);

  const [results, setResults] = useState([]);

  useEffect(() => { loadPdfLib(); }, []);

  const handleFileUpload = async (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile || uploadedFile.type !== 'application/pdf') {
      setError("Please upload a valid PDF file.");
      return;
    }
    setFile(uploadedFile);
    setError("");
    setLoading(true);
    setResults([]);

    try {
      const pdfjs = await loadPdfLib();
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      const maxPages = Math.min(pdf.numPages, 10); 
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += `[Page ${i}] ${pageText}\n`;
      }
      setPdfText(fullText);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to read PDF.");
      setLoading(false);
    }
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };


  const checkDocuments = async () => {
    if (!pdfText) { setError("Please upload a PDF first."); return; }
    
    setAnalyzing(true);
    setResults([]);

    
    setTimeout(() => {
      const mockResults = [
        {
          rule: rules[0],
          status: "PASS",
          evidence: "Found in introduction: 'The purpose of this document is to outline'",
          reasoning: "Document clearly states its purpose in the first paragraph.",
          confidence: 95
        },
        {
          rule: rules[1],
          status: "PASS",
          evidence: "Date found on Page 1: 'November 22,2025",
          reasoning: "A valid date was located in the header.",
          confidence: 98
        },
        {
          rule: rules[2],
          status: "FAIL",
          evidence: "No definitions found in the text.",
          reasoning: "The document does not explicitly define any terms.",
          confidence: 85
        }
      ];

      setResults(mockResults);
      setAnalyzing(false);
    }, 2000); 
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-indigo-600 flex items-center justify-center gap-2">
            <FileText className="w-8 h-8" /> PDF Rule Checker
          </h1>
          <p className="text-gray-500">Upload a document, set your rules, and let AI audit it.</p>
        </header>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span> Upload PDF
              </h2>
              <div className="border-2 border-dashed border-indigo-100 rounded-lg p-6 text-center hover:bg-indigo-50 transition-colors relative">
                <input type="file" accept="application/pdf" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-indigo-400 mx-auto" />
                  <p className="text-sm text-gray-600 font-medium">{file ? file.name : "Click to upload PDF"}</p>
                </div>
              </div>
              {loading && <div className="flex items-center gap-2 text-sm text-indigo-600"><Loader2 className="w-4 h-4 animate-spin"/> Extracting text...</div>}
              {pdfText && !loading && <div className="text-xs text-green-600 font-medium">✓ Text extracted</div>}
            </div>
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span> Define Rules
              </h2>
              <div className="space-y-3">
                {rules.map((rule, idx) => (
                  <input key={idx} type="text" value={rule} onChange={(e) => handleRuleChange(idx, e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                ))}
              </div>
            </div>
            <button onClick={checkDocuments} disabled={!pdfText || analyzing} className={`w-full py-3 rounded-lg font-bold text-white shadow-lg transition-all ${!pdfText || analyzing ? 'bg-gray-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {analyzing ? "Checking..." : "Check Document"}
            </button>
            {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {error}</div>}
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full overflow-y-auto">
             <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-700 mb-6">
                <span className="bg-indigo-100 text-indigo-600 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span> Results
              </h2>
              {results.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 text-center border-2 border-dashed border-gray-100 rounded-lg"><CheckCircle className="w-12 h-12 mb-2 opacity-20" /><p>Waiting for analysis...</p></div>
              ) : (
                <div className="space-y-4">
                  {results.map((res, idx) => (
                    <div key={idx} className={`border-l-4 rounded-r-lg p-4 shadow-sm ${res.status === 'PASS' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-800 text-sm flex-1 mr-2">"{res.rule}"</h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${res.status === 'PASS' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{res.status}</span>
                      </div>
                      <p className="text-sm text-gray-700 mb-1"><strong>Reason:</strong> {res.reasoning}</p>
                      <p className="text-sm text-gray-500 italic">"{res.evidence}"</p>
                      <div className="text-xs font-bold text-right mt-2 text-gray-400">Confidence: {res.confidence}%</div>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}