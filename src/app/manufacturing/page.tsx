"use client";

import { useState } from 'react';
import { generateBaseCabinet, generateCutList } from '@/lib/cabinet-generator';
import { generateJobsForCabinet } from '@/lib/cnc-operations';
import { generateGCode, downloadGCode } from '@/lib/gcode-generator';
import { CabinetWidth } from '@/types/cabinet.types';
import { ManufacturingJob } from '@/types/manufacturing.types';
import ToolpathVisualization from '@/components/ToolpathVisualization';

export default function ManufacturingPage() {
  const [selectedWidth, setSelectedWidth] = useState<CabinetWidth>(24);
  const [jobs, setJobs] = useState<ManufacturingJob[]>([]);
  const [selectedJobIndex, setSelectedJobIndex] = useState<number>(0);

  const handleGenerateJobs = () => {
    const cabinet = generateBaseCabinet(selectedWidth);
    const cutList = generateCutList(cabinet);
    const manufacturingJobs = generateJobsForCabinet(cutList);
    setJobs(manufacturingJobs);
    setSelectedJobIndex(0);
  };

  const handleDownloadGCode = (job: ManufacturingJob) => {
    const gcode = generateGCode(job);
    downloadGCode(gcode);
  };

  const widths: CabinetWidth[] = [9, 12, 15, 18, 21, 24, 27, 30, 33, 36];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="p-6 pt-20">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CNC Manufacturing
            </h1>
            <p className="text-gray-400 text-lg">
              Generate toolpaths and G-code for cabinet components
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold mb-4">Cabinet Configuration</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Cabinet Width</label>
                    <select
                      value={selectedWidth}
                      onChange={(e) => setSelectedWidth(Number(e.target.value) as CabinetWidth)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2"
                    >
                      {widths.map((w) => (
                        <option key={w} value={w}>
                          {w}"
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleGenerateJobs}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-3 rounded-lg font-semibold transition-all"
                  >
                    Generate Manufacturing Jobs
                  </button>
                </div>
              </div>

              {jobs.length > 0 && (
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h2 className="text-xl font-bold mb-4">Components ({jobs.length})</h2>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {jobs.map((job, index) => (
                      <button
                        key={job.id}
                        onClick={() => setSelectedJobIndex(index)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedJobIndex === index ? 'bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <div className="font-semibold text-sm">{job.componentName}</div>
                        <div className="text-xs text-gray-300 mt-1">
                          {job.width}" × {job.height}" × {job.thickness}"
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {job.operations.length} ops • {Math.ceil(job.totalTime)} min
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-4">
              {jobs.length > 0 && jobs[selectedJobIndex] ? (
                <>
                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{jobs[selectedJobIndex].componentName}</h2>
                        <p className="text-gray-400 text-sm mt-1">
                          {jobs[selectedJobIndex].material} • {jobs[selectedJobIndex].thickness}" thick
                        </p>
                      </div>
                      <button
                        onClick={() => handleDownloadGCode(jobs[selectedJobIndex])}
                        className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold text-sm"
                      >
                        Download G-Code
                      </button>
                    </div>

                    <ToolpathVisualization job={jobs[selectedJobIndex]} width={700} height={500} />
                  </div>

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-4">Operations</h3>

                    <div className="space-y-3">
                      {jobs[selectedJobIndex].operations.map((op, index) => (
                        <div key={op.id} className="bg-gray-700 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold text-sm">{index + 1}. {op.name}</div>
                              <div className="text-xs text-gray-400 mt-1">
                                {op.tool.name} • {op.tool.diameter}mm • {op.tool.rpm} RPM
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-400">Depth</div>
                              <div className="font-mono text-sm">{op.depth.toFixed(1)}mm</div>
                            </div>
                          </div>
                          {op.passes && op.passes > 1 && (
                            <div className="mt-2 text-xs text-gray-400">
                              {op.passes} passes • ~{Math.ceil(op.estimatedTime || 0)}s
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {jobs[selectedJobIndex].edgeBanding && (
                    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                      <h3 className="text-xl font-bold mb-4">Edge Banding</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-400">Edges</div>
                          <div className="font-mono mt-1">
                            {jobs[selectedJobIndex].edgeBanding?.edges.join(', ')}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400">Material</div>
                          <div className="font-mono mt-1">
                            {jobs[selectedJobIndex].edgeBanding?.material} • {jobs[selectedJobIndex].edgeBanding?.thickness}mm
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 className="text-xl font-bold mb-4">Time Estimate</h3>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-400">Setup</div>
                        <div className="text-2xl font-bold mt-1">{jobs[selectedJobIndex].setupTime} min</div>
                      </div>
                      <div className="bg-gray-700 rounded-lg p-4">
                        <div className="text-sm text-gray-400">Machining</div>
                        <div className="text-2xl font-bold mt-1">{Math.ceil(jobs[selectedJobIndex].machiningTime)} min</div>
                      </div>
                      <div className="bg-blue-600 rounded-lg p-4">
                        <div className="text-sm text-blue-200">Total</div>
                        <div className="text-2xl font-bold mt-1">{Math.ceil(jobs[selectedJobIndex].totalTime)} min</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                  <div className="text-6xl mb-4">🏭</div>
                  <h3 className="text-xl font-bold mb-2">No Manufacturing Jobs Generated</h3>
                  <p className="text-gray-400">
                    Select a cabinet width and click "Generate Manufacturing Jobs" to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
