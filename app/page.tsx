'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/file-upload';
import { JobDescriptionInput } from '@/components/job-description-input';
import { AnalysisResults } from '@/components/analysis-results';
import { LoadingState } from '@/components/loading-state';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Target, Zap } from 'lucide-react';

export interface AnalysisResult {
  ats_score: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendations: string[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!file || !jobDescription.trim()) {
      setError('Please upload a resume and enter a job description');
      return;
    }

    setIsAnalyzing(true);
    setError('');
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobDescription', jobDescription);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const result = await response.json();
      setResults(result);
    } catch (err) {
      setError('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setFile(null);
    setJobDescription('');
    setResults(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
              <Target className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Resume <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Analyzer</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get your ATS score and optimize your resume for any job description using advanced AI analysis
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <FileText className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">Smart Parsing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Advanced text extraction from PDF and DOCX files with high accuracy
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <Zap className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Powered by Google Gemini for comprehensive resume evaluation
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="pb-3">
              <Target className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">ATS Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-sm">
                Detailed insights to improve your resume's compatibility with ATS systems
              </p>
            </CardContent>
          </Card>
        </div>

        {!results ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Job Description Input */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={setJobDescription}
                />
              </CardContent>
            </Card>

            {/* Resume Upload */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Upload Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <FileUpload file={file} onFileSelect={setFile} />
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Error Message */}
        {error && (
          <Card className="bg-red-50/80 border-red-200 mt-8">
            <CardContent className="pt-6">
              <p className="text-red-700 text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isAnalyzing && <LoadingState />}

        {/* Analysis Results */}
        {results && (
          <div className="mt-8">
            <AnalysisResults results={results} />
            <div className="text-center mt-8">
              <Button 
                onClick={resetAnalysis}
                variant="outline"
                className="bg-white/80 hover:bg-white"
              >
                Analyze Another Resume
              </Button>
            </div>
          </div>
        )}

        {/* Action Button */}
        {!results && !isAnalyzing && (
          <div className="text-center mt-12">
            <Button 
              onClick={handleAnalyze}
              disabled={!file || !jobDescription.trim()}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-12 py-4 text-lg font-semibold shadow-xl disabled:opacity-50"
            >
              <Target className="w-5 h-5 mr-2" />
              Analyze Resume
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}