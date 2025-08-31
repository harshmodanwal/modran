'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Brain, FileSearch, Target } from 'lucide-react';

export function LoadingState() {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mt-8">
      <CardContent className="py-12">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="animate-pulse bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full inline-block">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin absolute -top-2 -left-2" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Analyzing Your Resume
            </h3>
            <p className="text-gray-600">
              Our AI is processing your resume and comparing it with the job requirements...
            </p>
          </div>

          <div className="flex justify-center space-x-8 mt-8">
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileSearch className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-600">Extracting Text</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-purple-100 p-3 rounded-full">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">AI Analysis</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className="bg-green-100 p-3 rounded-full">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm text-gray-600">Generating Score</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}