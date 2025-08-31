'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { CheckCircle, XCircle, Lightbulb, Award } from 'lucide-react';
import { AnalysisResult } from '@/app/page';

interface AnalysisResultsProps {
  results: AnalysisResult;
}

export function AnalysisResults({ results }: AnalysisResultsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600';
    if (score >= 60) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  // Prepare data for radar chart
  const radarData = [
    { skill: 'Technical Skills', matched: results.matched_skills.length, total: results.matched_skills.length + results.missing_skills.length },
    { skill: 'Keywords', matched: Math.round(results.ats_score * 0.8), total: 100 },
    { skill: 'Format', matched: Math.round(results.ats_score * 0.9), total: 100 },
    { skill: 'Content', matched: Math.round(results.ats_score * 0.85), total: 100 },
  ];

  return (
    <div className="space-y-8">
      {/* ATS Score Header */}
      <Card className="bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader className="text-center pb-8">
          <CardTitle className="text-2xl font-bold mb-6">Analysis Complete</CardTitle>
          <div className="relative inline-block">
            <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${getScoreColor(results.ats_score)} p-1 mx-auto mb-4`}>
              <div className="bg-white w-full h-full rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">{results.ats_score}</div>
                  <div className="text-sm text-gray-600">ATS Score</div>
                </div>
              </div>
            </div>
            <Award className="w-6 h-6 text-yellow-500 absolute -top-2 -right-2" />
          </div>
          <div className="text-lg font-semibold text-gray-700">
            {getScoreLabel(results.ats_score)}
          </div>
        </CardHeader>
      </Card>

      {/* Progress Overview */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Overall ATS Score</span>
                <span className="text-sm font-bold text-gray-900">{results.ats_score}/100</span>
              </div>
              <Progress value={results.ats_score} className="h-3" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Skills Match</span>
                <span className="text-sm font-bold text-gray-900">
                  {results.matched_skills.length}/{results.matched_skills.length + results.missing_skills.length}
                </span>
              </div>
              <Progress 
                value={(results.matched_skills.length / (results.matched_skills.length + results.missing_skills.length)) * 100} 
                className="h-3" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Skills Analysis */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                Matched Skills ({results.matched_skills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.matched_skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <XCircle className="w-5 h-5" />
                Missing Skills ({results.missing_skills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.missing_skills.map((skill, index) => (
                  <Badge key={index} variant="destructive" className="bg-red-100 text-red-800 border-red-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Radar Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Skills Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <Radar
                  name="Matched"
                  dataKey="matched"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-600" />
            Recommendations for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="bg-yellow-100 p-1 rounded-full mt-0.5">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                </div>
                <p className="text-gray-700 leading-relaxed">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}