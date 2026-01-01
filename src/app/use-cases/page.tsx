import { useState } from 'react';
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { 
  DoorOpen, 
  Archive, 
  Grid3x3, 
  Package, 
  Wrench, 
  ArrowRight,
  Home,
  Kitchen,
  PackageOpen,
  Settings,
  Drill
} from 'lucide-react';

const USE_CASES = [
  {
    id: 'kitchen-cabinet-doors',
    title: 'Kitchen Cabinet Doors',
    description: 'Configure hinge drilling for standard kitchen cabinet doors',
    icon: DoorOpen,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    patterns: ['Blum ClipTop', 'Hettich Sensys', 'Häfele Hinges'],
    difficulty: 'Beginner',
    time: '5-10 min',
    href: '/use-cases/kitchen-doors'
  },
  {
    id: 'drawer-slides',
    title: 'Drawer Slide Installation',
    description: 'Set up drawer slide drilling for cabinet sides and drawer boxes',
    icon: Archive,
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    patterns: ['Blum TANDEM', 'Blum MOVENTO', 'Hettich InnoTech'],
    difficulty: 'Intermediate',
    time: '10-15 min',
    href: '/use-cases/drawer-slides'
  },
  {
    id: 'system-32-shelving',
    title: 'System 32 Shelving',
    description: 'Configure 32mm system drilling for adjustable shelves and construction',
    icon: Grid3x3,
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    patterns: ['System 32 Row', 'Shelf Support Holes'],
    difficulty: 'Intermediate',
    time: '8-12 min',
    href: '/use-cases/system-32'
  },
  {
    id: 'cabinet-assembly',
    title: 'Cabinet Assembly Joints',
    description: 'Create dowel joint patterns for cabinet construction',
    icon: Package,
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    patterns: ['Side Dowel Joints', 'Back Panel Nailers'],
    difficulty: 'Advanced',
    time: '15-20 min',
    href: '/use-cases/cabinet-assembly'
  },
  {
    id: 'complete-workflow',
    title: 'Complete Cabinet Workflow',
    description: 'Full cabinet drilling workflow from doors to assembly',
    icon: PackageOpen,
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    patterns: ['All Patterns'],
    difficulty: 'Advanced',
    time: '30-45 min',
    href: '/use-cases/complete-cabinet'
  },
  {
    id: 'custom-patterns',
    title: 'Custom Pattern Design',
    description: 'Create custom drilling patterns for unique applications',
    icon: Wrench,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    patterns: ['Grid, Linear, Circular'],
    difficulty: 'Beginner',
    time: '5-10 min',
    href: '/drill-configurator'
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export default function UseCasesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredUseCases = USE_CASES.filter(useCase => 
    selectedCategory === 'all' || 
    (selectedCategory === 'beginner' && useCase.difficulty === 'Beginner') ||
    (selectedCategory === 'intermediate' && useCase.difficulty === 'Intermediate') ||
    (selectedCategory === 'advanced' && useCase.difficulty === 'Advanced')
  );

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white">
      <div className="pt-20 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Home className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
                CNC Drill Pattern Use Cases
              </h1>
              <p className="text-lg text-slate-600 dark:text-[#90a7cb] mt-2">
                Step-by-step workflows for common cabinet making scenarios
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{USE_CASES.length}</div>
              <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Use Cases</div>
            </Card>
            <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {USE_CASES.filter(uc => uc.difficulty === 'Beginner').length}
              </div>
              <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Beginner</div>
            </Card>
            <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {USE_CASES.filter(uc => uc.difficulty === 'Intermediate').length}
              </div>
              <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Intermediate</div>
            </Card>
            <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {USE_CASES.filter(uc => uc.difficulty === 'Advanced').length}
              </div>
              <div className="text-sm text-slate-500 dark:text-[#90a7cb]">Advanced</div>
            </Card>
          </div>

          {/* Filter Tabs */}
          <Card className="p-4 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5">
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                All Use Cases
              </Button>
              <Button
                variant={selectedCategory === 'beginner' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('beginner')}
              >
                Beginner
              </Button>
              <Button
                variant={selectedCategory === 'intermediate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('intermediate')}
              >
                Intermediate
              </Button>
              <Button
                variant={selectedCategory === 'advanced' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('advanced')}
              >
                Advanced
              </Button>
            </div>
          </Card>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUseCases.map((useCase) => {
            const Icon = useCase.icon;
            
            return (
              <Link key={useCase.id} href={useCase.href}>
                <Card className="p-6 bg-white dark:bg-[#182334] border-slate-200 dark:border-white/5 hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${useCase.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {useCase.title}
                        </h3>
                        <Badge className={`text-xs mt-1 ${getDifficultyColor(useCase.difficulty)}`}>
                          {useCase.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-[#90a7cb] mb-4">
                    {useCase.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {useCase.patterns.slice(0, 3).map((pattern, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {pattern}
                        </Badge>
                      ))}
                      {useCase.patterns.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{useCase.patterns.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-[#90a7cb]">
                      <span>⏱ {useCase.time}</span>
                      <div className="flex items-center gap-1">
                        <span>Start</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Start Section */}
        <div className="mt-12">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-slate-200 dark:border-white/5">
            <div className="text-center">
              <Kitchen className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                New to Cabinet Making?
              </h2>
              <p className="text-slate-600 dark:text-[#90a7cb] mb-6 max-w-2xl mx-auto">
                Start with our beginner-friendly kitchen cabinet door configuration. 
                Learn the fundamentals of hinge drilling and work your way up to advanced cabinet assembly.
              </p>
              <div className="flex gap-4 justify-center">
                <Link href="/use-cases/kitchen-doors">
                  <Button size="lg">
                    <DoorOpen className="w-5 h-5 mr-2" />
                    Start with Kitchen Doors
                  </Button>
                </Link>
                <Link href="/drill-patterns">
                  <Button variant="outline" size="lg">
                    <Drill className="w-5 h-5 mr-2" />
                    Browse All Patterns
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
