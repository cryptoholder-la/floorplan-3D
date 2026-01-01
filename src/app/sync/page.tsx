import { useState, useEffect } from 'react';
import { useState, useEffect } from 'react';
"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/ui/card';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { 
  Smartphone, 
  Tablet, 
  Monitor, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  ArrowUpDown,
  Maximize2,
  Grid3x3,
  Eye,
  Settings,
  Save,
  Upload,
  Download,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock,
  Users,
  Shield,
  Database
} from 'lucide-react';

// Sync status types
type SyncStatus = 'online' | 'offline' | 'syncing' | 'error';
type DeviceType = 'mobile' | 'tablet' | 'desktop';

interface ConnectedDevice {
  id: string;
  name: string;
  type: DeviceType;
  lastSeen: Date;
  status: 'active' | 'inactive';
}

interface SyncEvent {
  id: string;
  type: 'sync' | 'conflict' | 'error' | 'success';
  timestamp: Date;
  deviceId: string;
  message: string;
}

// Sync dashboard component
function SyncDashboard() {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('online');
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);
  const [syncEvents, setSyncEvents] = useState<SyncEvent[]>([]);
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState(true);
  const [syncInterval, setSyncInterval] = useState(5); // seconds

  // Simulate connected devices
  useEffect(() => {
    const devices: ConnectedDevice[] = [
      {
        id: 'desktop-001',
        name: 'Desktop Computer',
        type: 'desktop',
        lastSeen: new Date(),
        status: 'active'
      },
      {
        id: 'tablet-001',
        name: 'iPad Pro',
        type: 'tablet',
        lastSeen: new Date(Date.now() - 2 * 60 * 1000),
        status: 'active'
      },
      {
        id: 'phone-001',
        name: 'iPhone 14',
        type: 'mobile',
        lastSeen: new Date(Date.now() - 5 * 60 * 1000),
        status: 'active'
      }
    ];
    setConnectedDevices(devices);

    // Simulate sync events
    const events: SyncEvent[] = [
      {
        id: 'sync-001',
        type: 'success',
        timestamp: new Date(Date.now() - 1 * 60 * 1000),
        deviceId: 'desktop-001',
        message: 'Floorplan data synchronized successfully'
      },
      {
        id: 'sync-002',
        type: 'sync',
        timestamp: new Date(Date.now() - 3 * 60 * 1000),
        deviceId: 'tablet-001',
        message: 'Use case configuration updated'
      },
      {
        id: 'sync-003',
        type: 'success',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        deviceId: 'phone-001',
        message: '3D viewer settings synchronized'
      }
    ];
    setSyncEvents(events);
  }, []);

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
      case 'desktop': return <Monitor className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: SyncStatus) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'offline': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'syncing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'error': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'sync': return <RefreshCw className="w-4 h-4 text-blue-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'conflict': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  return (
    <div className="space-y-6">
      {/* Sync Status Overview */}
      <Card className="p-6 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sync Status
          </h3>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(syncStatus)}>
              {syncStatus.charAt(0).toUpperCase() + syncStatus.slice(1)}
            </Badge>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Wifi className="w-5 h-5 text-green-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Connection</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Stable connection
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Database className="w-5 h-5 text-blue-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Data Size</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                2.4 MB synced
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <Clock className="w-5 h-5 text-purple-500" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">Last Sync</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                2 minutes ago
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Connected Devices */}
      <Card className="p-6 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Connected Devices
          </h3>
          <Badge variant="outline">
            {connectedDevices.length} devices
          </Badge>
        </div>

        <div className="space-y-3">
          {connectedDevices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {getDeviceIcon(device.type)}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {device.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Last seen {formatTimeAgo(device.lastSeen)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  device.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <Badge variant="outline" className="text-xs">
                  {device.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sync Events */}
      <Card className="p-6 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Sync Events
          </h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>

        <div className="space-y-3">
          {syncEvents.map((event) => (
            <div key={event.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="mt-1">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">
                  {event.message}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {event.deviceId} • {formatTimeAgo(event.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Sync Settings */}
      <Card className="p-6 bg-white dark:bg-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Sync Settings
          </h3>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Auto-sync
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Automatically sync data every {syncInterval} seconds
              </div>
            </div>
            <Button
              variant={isAutoSyncEnabled ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsAutoSyncEnabled(!isAutoSyncEnabled)}
            >
              {isAutoSyncEnabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Sync Interval
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                How often to check for updates
              </div>
            </div>
            <select
              value={syncInterval}
              onChange={(e) => setSyncInterval(Number(e.target.value))}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm"
            >
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                Offline Mode
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Work without internet connection
              </div>
            </div>
            <Button variant="outline" size="sm">
              Configure
            </Button>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-6 bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
            <RefreshCw className="w-5 h-5" />
            <span>Sync Now</span>
          </Button>

          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
            <Upload className="w-5 h-5" />
            <span>Export Data</span>
          </Button>

          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
            <Download className="w-5 h-5" />
            <span>Import Data</span>
          </Button>

          <Button variant="outline" className="flex flex-col items-center gap-2 h-auto py-4">
            <Shield className="w-5 h-5" />
            <span>Security</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Main sync page
export default function SyncPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="pt-20 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Sync Dashboard
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Real-time synchronization across all your devices
              </p>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">3 devices</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">2.4 MB synced</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Last sync: 2m ago</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <SyncDashboard />
      </div>
    </div>
  );
}
