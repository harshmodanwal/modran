import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeResumeWithGemini(resumeText: string, jobDescription: string) {
  try {
    console.log('Initializing Gemini model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
You are an expert ATS (Applicant Tracking System) and resume analyzer. Analyze the following resume against the job description and provide a comprehensive evaluation.

Job Description:
${jobDescription}

Resume Content:
${resumeText}

Please analyze and return a JSON response with the following structure:
{
  "ats_score": <number between 0-100>,
  "matched_skills": [<array of skills found in both resume and job description>],
  "missing_skills": [<array of important skills from job description not found in resume>],
  "recommendations": [<array of specific actionable recommendations to improve the resume>]
}

Evaluation Criteria:
1. ATS Score (0-100): Based on keyword matching, formatting compatibility, and content relevance
2. Skills Analysis: Compare technical and soft skills mentioned in job description vs resume
3. Recommendations: Provide 4-6 specific, actionable suggestions to improve ATS compatibility

Focus on:
- Keywords and phrases from job description
- Required vs preferred qualifications
- Technical skills matching
- Professional experience relevance
- Education and certification alignment
- ATS-friendly formatting considerations

Return only the JSON response without any additional text or formatting.
`;

    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Received response from Gemini, parsing...');
    
    // Clean up the response and parse JSON
    const cleanedText = text.replace(/```json\s*|\s*```/g, '').trim();
    
    try {
      const analysis = JSON.parse(cleanedText);
      
      // Validate the response structure
      if (typeof analysis.ats_score !== 'number' ||
          !Array.isArray(analysis.matched_skills) ||
          !Array.isArray(analysis.missing_skills) ||
          !Array.isArray(analysis.recommendations)) {
        console.error('Invalid response structure:', analysis);
        throw new Error('Invalid response structure');
      }
      
      // Ensure ATS score is within valid range
      analysis.ats_score = Math.max(0, Math.min(100, analysis.ats_score));
      
      console.log('Analysis completed successfully');
      return analysis;
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw response:', text);
      throw new Error('Failed to parse AI response');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    throw new Error('AI analysis failed');
  }
}