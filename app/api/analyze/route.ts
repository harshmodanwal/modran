import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromFile } from '@/lib/file-parser';
import { analyzeResumeWithGemini } from '@/lib/gemini-client';

export async function POST(request: NextRequest) {
  try {
    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY environment variable is not set');
      return NextResponse.json(
        { error: 'Server configuration error. Please check API key setup.' },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('resume') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!file || !jobDescription) {
      console.error('Missing file or job description');
      return NextResponse.json(
        { error: 'Missing resume file or job description' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type);
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a PDF or DOCX file.' },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      console.error('File too large:', file.size);
      return NextResponse.json(
        { error: 'File too large. Please upload a file smaller than 10MB.' },
        { status: 400 }
      );
    }

    // Extract text from resume
    console.log('Extracting text from file:', file.name, file.type);
    const resumeText = await extractTextFromFile(file);
    console.log('Extracted text length:', resumeText.length);
    
    if (!resumeText || resumeText.trim().length < 50) {
      console.error('Insufficient text extracted:', resumeText.length);
      return NextResponse.json(
        { error: 'Could not extract sufficient text from the resume. Please check the file format.' },
        { status: 400 }
      );
    }

    // Analyze with Gemini
    console.log('Starting Gemini analysis...');
    const analysis = await analyzeResumeWithGemini(resumeText, jobDescription);
    console.log('Analysis completed successfully');
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    );
  }
}