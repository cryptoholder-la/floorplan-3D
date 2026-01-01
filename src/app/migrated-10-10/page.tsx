'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge-simple';
import { tenTenSystem, AgentTask, CabinetItem, FloorplanData } from '@/lib/10_10-main';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Settings, 
  Eye, 
  Box, 
  Wrench,
  Home,
  Package,
  FileText,
  Upload,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  Activity
} from 'lucide-react';

export default function MigratedTenTenPage() {
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [cabinets, setCabinets] = useState<CabinetItem[]>([]);
  const [floorplan, setFloorplan] = useState<FloorplanData | null>(null);
  const [isSystemRunning, setIsSystemRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Initialize 10_10 system
  useEffect(() => {
    tenTenSystem.init();
    
    // Subscribe to agent updates
    const unsubscribe = tenTenSystem.agents.subscribe((tasks) => {
      setAgentTasks(tasks);
    });

    // Load initial data
    loadInitialData();

    return unsubscribe;
  }, []);

  const loadInitialData = () => {
    // Create some sample cabinets
    const sampleCabinets = [
      tenTenSystem.cabinets.createCabinet('Base_D24_Standard', { position: [0, 0, 0] }),
      tenTenSystem.cabinets.createCabinet('Wall_H30_D12_Standard', { position: [610, 0, 0] }),
      tenTenSystem.cabinets.createCabinet('SinkBase_D24_Standard', { position: [1220, 0, 0] })
    ];
    
    setCabinets(sampleCabinets);
    
    // Add some sample agent tasks
    tenTenSystem.agents.addTask({
      type: 'nkba_check',
      agent: 'nkba',
      payload: { cabinets: sampleCabinets }
    });
    
    tenTenSystem.agents.addTask({
      type: 'optimization',
      agent: 'optimization',
      payload: { target: 'material_usage' }
    });
  };

  const handleAddCabinet = (templateId: string) => {
    try {
      const newCabinet = tenTenSystem.cabinets.createCabinet(templateId, {
        position: [Math.random() * 2000, 0, Math.random() * 2000]
      });
      
      setCabinets(prev => [...prev, newCabinet]);
      
      // Trigger agent task
      tenTenSystem.agents.addTask({
        type: 'cabinet_added',
        agent: 'inventory',
        payload: { cabinet: newCabinet }
      });
    } catch (error) {
      console.error('Failed to create cabinet:', error);
    }
  };

  const handleScanFloorplan = async () => {
    try {
      const scannedData = await tenTenSystem.scanner.scanFromImage(new File([], 'mock.jpg'));
      setFloorplan(scannedData);
      
      tenTenSystem.agents.addTask({
        type: 'floorplan_scanned',
        agent: 'scanner',
        payload: { floorplan: scannedData }
      });
    } catch (error) {
      console.error('Failed to scan floorplan:', error);
    }
  };

  const handleComplianceCheck = () => {
    if (!floorplan || cabinets.length === 0) return;
    
    const result = tenTenSystem.compliance.checkDesign(cabinets, floorplan);
    
    tenTenSystem.agents.addTask({
      type: 'compliance_check',
      agent: 'nkba',
      payload: { result }
    });
    
    return result;
  };

  const handleGenerateCutlist = () => {
    if (cabinets.length === 0) return;
    
    const cutlist = tenTenSystem.cnc.generateCutlist(cabinets);
    
    tenTenSystem.agents.addTask({
      type: 'cutlist_generated',
      agent: 'cnc',
      payload: { cutlist }
    });
    
    return cutlist;
  };

  const activeTasks = agentTasks.filter(t => t.status === 'running');
  const recentTasks = agentTasks.slice(-10).reverse();

  const renderAgentDashboard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Agent System Monitor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <Badge variant={activeTasks.length > 0 ? "default" : "secondary"}>
              Active: {activeTasks.length}
            </Badge>
            <Badge variant="outline">
              Total: {agentTasks.length}
            </Badge>
            <Button
              variant={isSystemRunning ? "destructive" : "default"}
              size="sm"
              onClick={() => setIsSystemRunning(!isSystemRunning)}
            >
              {isSystemRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isSystemRunning ? 'Pause' : 'Start'}
            </Button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {recentTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-2 bg-gray-800 rounded text-sm">
                <div className="flex items-center gap-2">
                  {task.status === 'running' && <Clock className="w-3 h-3 text-yellow-400" />}
                  {task.status === 'completed' && <CheckCircle className="w-3 h-3 text-green-400" />}
                  {task.status === 'failed' && <XCircle className="w-3 h-3 text-red-400" />}
                  {task.status === 'queued' && <Clock className="w-3 h-3 text-gray-400" />}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{task.type}</div>
                  <div className="text-xs text-gray-400">{task.agent}</div>
                </div>
                {task.duration && (
                  <div className="text-xs text-gray-400">
                    {task.duration.toFixed(0)}ms
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCabinetManager = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Box className="w-5 h-5" />
          Cabinet Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => handleAddCabinet('Base_D24_Standard')} size="sm">
              Add Base Cabinet
            </Button>
            <Button onClick={() => handleAddCabinet('Wall_H30_D12_Standard')} size="sm">
              Add Wall Cabinet
            </Button>
            <Button onClick={() => handleAddCabinet('Tall_Pantry_H84_D24_Standard')} size="sm">
              Add Tall Cabinet
            </Button>
          </div>
          
          <div className="grid gap-2">
            {cabinets.map(cabinet => (
              <div key={cabinet.id} className="flex items-center justify-between p-3 bg-gray-800 rounded">
                <div>
                  <div className="font-medium">{cabinet.type} Cabinet</div>
                  <div className="text-sm text-gray-400">
                    {cabinet.width} × {cabinet.height} × {cabinet.depth}mm
                  </div>
                  <div className="text-xs text-gray-500">
                    {cabinet.material} • {cabinet.style}
                  </div>
                </div>
                <Badge variant="outline">{cabinet.type}</Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderFloorplanScanner = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Floorplan Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleScanFloorplan} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            Scan Floorplan from Image
          </Button>
          
          {floorplan && (
            <div className="p-4 bg-gray-800 rounded">
              <h4 className="font-medium mb-2">Scanned Floorplan Data</h4>
              <div className="text-sm text-gray-400 space-y-1">
                <div>Walls: {floorplan.walls.length}</div>
                <div>Rooms: {floorplan.rooms.length}</div>
                <div>Openings: {floorplan.openings.length}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderComplianceChecker = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          NKBA Compliance Checker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleComplianceCheck} disabled={!floorplan || cabinets.length === 0}>
            Check Compliance
          </Button>
          
          <div className="text-sm text-gray-400">
            <p>• Work triangle validation</p>
            <p>• Landing area requirements</p>
            <p>• Clearance standards</p>
            <p>• Accessibility compliance</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCNCGenerator = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          CNC Cutlist Generator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={handleGenerateCutlist} disabled={cabinets.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Generate Cutlist
          </Button>
          
          <div className="text-sm text-gray-400">
            <p>• 32mm system drilling</p>
            <p>• Material optimization</p>
            <p>• Barcode generation</p>
            <p>• G-code export</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            10_10 Design System - Migrated
          </h1>
          <p className="text-gray-400">
            Advanced kitchen design tools with AI integration and real-time agent monitoring
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {['dashboard', 'cabinets', 'scanner', 'compliance', 'cnc'].map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab)}
              size="sm"
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeTab === 'dashboard' && renderAgentDashboard()}
          {activeTab === 'cabinets' && renderCabinetManager()}
          {activeTab === 'scanner' && renderFloorplanScanner()}
          {activeTab === 'compliance' && renderComplianceChecker()}
          {activeTab === 'cnc' && renderCNCGenerator()}
          
          {/* Always show agent dashboard */}
          {activeTab !== 'dashboard' && renderAgentDashboard()}
        </div>

        {/* System Status */}
        <div className="mt-8 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant={isSystemRunning ? "default" : "secondary"}>
                System: {isSystemRunning ? 'Running' : 'Stopped'}
              </Badge>
              <Badge variant="outline">
                Cabinets: {cabinets.length}
              </Badge>
              {floorplan && (
                <Badge variant="outline">
                  Floorplan: Scanned
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-400">
              10_10 Design System v2.0 • Integrated with Memlayer AI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
