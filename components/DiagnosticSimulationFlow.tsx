import React, { useState, useEffect } from 'react';
import { SkillStatus, Domain } from '../types';

interface DiagnosticSimulationFlowProps {
  onComplete: () => void;
}

const DiagnosticSimulationFlow: React.FC<DiagnosticSimulationFlowProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'simulating' | 'results' | 'generating'>('simulating');
  const [wizardStep, setWizardStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Initializing Engine...');
  const [activeZone, setActiveZone] = useState<SkillStatus>(SkillStatus.LEARNING);
  const [activeDomain, setActiveDomain] = useState<Domain>(Domain.QUANT);

  const initialTasks = [
    'Analyzing Verbal Section...',
    'Processing Quantitative Section...',
    'Calibrating Data Insights Items...',
    'Evaluating Critical Reasoning Patterns...',
    'Analyzing Data Sufficiency Logic...',
    'Calculating Bayesian Mastery Trajectories...',
    'Finalizing Adaptive Profile...'
  ];

  const generationTasks = [
    'Optimizing skill sequence...',
    'Prioritizing high-yield topics...',
    'Building personalized drills...',
    'Mapping reinforcement milestones...',
    'Calibrating your study schedule...'
  ];

  const zoneDescriptions = {
    [SkillStatus.MASTERED]: "You are already proficient in these skills, so these will be periodically scheduled for review",
    [SkillStatus.LEARNING]: "Your study plan will focus on improving proficiency in these skills",
    [SkillStatus.NOT_READY]: "These are low-yield topics for your score goal and will be addressed once you master everything in your Learning zone."
  };

  const domainZoneContent = {
    [Domain.QUANT]: {
      stats: { mastered: 15, learning: 45, notReady: 40 },
      zones: {
        [SkillStatus.MASTERED]: {
          label: 'Mastered',
          color: 'bg-emerald-500',
          count: 4,
          skills: ['Integer Properties', 'Fractions and Decimals', 'Ratios and Proportions', 'Percentages']
        },
        [SkillStatus.LEARNING]: {
          label: 'Learning',
          color: 'bg-amber-400',
          count: 12,
          skills: ['Linear Equations', 'Quadratic Equations', 'Inequalities', 'Functions', 'Sequences']
        },
        [SkillStatus.NOT_READY]: {
          label: 'Not Ready',
          color: 'bg-slate-400',
          count: 14,
          skills: ['Coordinate Geometry', 'Triangles and Circles', '3D Geometry', 'Combinatorics', 'Probability']
        }
      }
    },
    [Domain.VERBAL]: {
      stats: { mastered: 25, learning: 55, notReady: 20 },
      zones: {
        [SkillStatus.MASTERED]: {
          label: 'Mastered',
          color: 'bg-emerald-500',
          count: 3,
          skills: ['Main Idea', 'Supporting Details', 'Logical Structure']
        },
        [SkillStatus.LEARNING]: {
          label: 'Learning',
          color: 'bg-amber-400',
          count: 6,
          skills: ['Inference', 'Find the Assumption', 'Strengthen the Argument', 'Weaken the Argument']
        },
        [SkillStatus.NOT_READY]: {
          label: 'Not Ready',
          color: 'bg-slate-400',
          count: 2,
          skills: ['Bold Face', 'Parallel Reasoning', 'Evaluate the Argument']
        }
      }
    },
    [Domain.DI]: {
      stats: { mastered: 10, learning: 60, notReady: 30 },
      zones: {
        [SkillStatus.MASTERED]: {
          label: 'Mastered',
          color: 'bg-emerald-500',
          count: 2,
          skills: ['Table Analysis', 'Graphics Interpretation']
        },
        [SkillStatus.LEARNING]: {
          label: 'Learning',
          color: 'bg-amber-400',
          count: 8,
          skills: ['Two-Part Analysis', 'Multi-Source Reasoning', 'Data Sufficiency Algebra']
        },
        [SkillStatus.NOT_READY]: {
          label: 'Not Ready',
          color: 'bg-slate-400',
          count: 5,
          skills: ['Integrated Reasoning', 'Data Sufficiency Geometry']
        }
      }
    }
  };

  useEffect(() => {
    if (phase === 'simulating' || phase === 'generating') {
      const currentTasks = phase === 'simulating' ? initialTasks : generationTasks;
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (phase === 'simulating') {
                setPhase('results');
                setProgress(0);
              } else {
                onComplete();
              }
            }, 800);
            return 100;
          }
          const step = phase === 'simulating' ? Math.random() * 5 + 2 : Math.random() * 20;
          const next = Math.min(100, prev + step);
          
          const taskIdx = Math.floor((next / 100) * currentTasks.length);
          if (currentTasks[taskIdx]) setCurrentTask(currentTasks[taskIdx]);
          
          return next;
        });
      }, phase === 'simulating' ? 150 : 350);
      return () => clearInterval(interval);
    }
  }, [phase]);

  const handleGeneratePlan = () => {
    setPhase('generating');
    setProgress(0);
    setCurrentTask('Architecting Study Plan...');
  };

  if (phase === 'simulating' || phase === 'generating') {
    return (
      <div className="fixed inset-0 z-[2000] bg-slate-950 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-md text-center">
          <div className="mb-12 relative flex flex-col items-center">
             {phase === 'simulating' ? (
               /* CIRCULAR CLOCK ANIMATION FOR DIAGNOSTIC TEST */
               <div className="relative w-48 h-48 mb-8">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="rgba(255,255,255,0.05)" 
                      strokeWidth="3" 
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="#10b981" 
                      strokeWidth="3" 
                      strokeDasharray="282.7" 
                      strokeDashoffset={282.7 - (282.7 * progress) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                    <line 
                      x1="50" y1="50" x2="50" y2="30" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                      style={{ 
                        transform: `rotate(${(progress * 3.6) + (progress * 0.5)}deg)`, 
                        transformOrigin: '50% 50%',
                        transition: 'transform 0.3s linear'
                      }} 
                    />
                    <line 
                      x1="50" y1="50" x2="50" y2="20" 
                      stroke="#10b981" 
                      strokeWidth="1.5" 
                      strokeLinecap="round"
                      style={{ 
                        transform: `rotate(${progress * 24}deg)`, 
                        transformOrigin: '50% 50%',
                        transition: 'transform 0.3s linear'
                      }} 
                    />
                  </svg>
               </div>
             ) : (
               /* RETAINED ICON FOR GENERATING PLAN */
               <div className="flex items-center justify-center text-7xl opacity-80 animate-pulse mb-8">
                 🎯
               </div>
             )}
          </div>
          
          <h2 className="text-4xl font-black mb-4 tracking-tight">
            {phase === 'simulating' ? 'Simulating Adaptive Test' : 'Generating Study Plan'}
          </h2>
          <p className="text-slate-400 font-bold text-base uppercase tracking-[0.2em] mb-12 min-h-[1.5em]">
            {currentTask}
          </p>

          {/* PROGRESS BAR - Only shown for Generating phase as requested */}
          {phase === 'generating' && (
            <div className="space-y-6">
              <div className="h-4 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-emerald-400 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(52,211,153,0.6)]" 
                  style={{ width: `${progress}%` }} 
                />
              </div>
              <div className="flex justify-between items-center text-base font-black uppercase tracking-widest text-slate-500">
                <span className="opacity-60">Plan Optimization</span>
                <span className="text-emerald-400 font-black">{Math.round(progress)}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentDomainData = domainZoneContent[activeDomain];
  const activeData = currentDomainData.zones[activeZone];

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-xl animate-in fade-in duration-500 overflow-y-auto overflow-x-hidden">
      <div className="min-h-full flex flex-col items-center justify-start py-12 md:py-24 px-6">
        <div className="bg-white rounded-[4rem] p-10 md:p-16 max-w-4xl w-full shadow-2xl relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
          
          <div className="flex justify-center gap-3 mb-12">
             <div className={`h-2.5 w-20 rounded-full transition-colors duration-500 ${wizardStep >= 1 ? 'bg-slate-900' : 'bg-slate-100'}`} />
             <div className={`h-2.5 w-20 rounded-full transition-colors duration-500 ${wizardStep >= 2 ? 'bg-slate-900' : 'bg-slate-100'}`} />
          </div>

          {wizardStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-16">
                <span className="text-base font-black text-slate-400 uppercase tracking-[0.3em] mb-12 block">Initial Baseline</span>
                <div className="flex justify-center items-baseline gap-3 mb-12">
                  <span className="text-9xl font-black text-slate-900 tracking-tighter">555</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-16">
                 <div className="text-center space-y-4">
                    <span className="block text-base font-black text-slate-400 uppercase tracking-widest">Quantitative</span>
                    <span className="text-5xl font-black text-slate-900">75</span>
                 </div>
                 <div className="text-center space-y-4">
                    <span className="block text-base font-black text-slate-400 uppercase tracking-widest">Verbal</span>
                    <span className="text-5xl font-black text-slate-900">73</span>
                 </div>
                 <div className="text-center space-y-4">
                    <span className="block text-base font-black text-slate-400 uppercase tracking-widest">Data Insights</span>
                    <span className="text-5xl font-black text-slate-900">74</span>
                 </div>
              </div>

              <button 
                onClick={() => setWizardStep(2)}
                className="w-full bg-slate-900 text-white py-7 rounded-[2.5rem] font-black text-lg uppercase tracking-widest transition-all hover:bg-slate-800 shadow-xl shadow-slate-200"
              >
                See Detailed Skills Map
              </button>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="text-center mb-12">
                 <h2 className="text-4xl font-black text-slate-900 mb-4">Your Skills Map</h2>
              </div>

              <div className="space-y-8">
                 <div>
                    <div className="flex justify-center mb-12">
                      <div className="inline-flex p-2 bg-slate-100 rounded-[2.5rem] border border-slate-200">
                        <button
                          onClick={() => setActiveDomain(Domain.QUANT)}
                          className={`px-6 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${
                            activeDomain === Domain.QUANT 
                              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Quantitative
                        </button>
                        <button
                          onClick={() => setActiveDomain(Domain.VERBAL)}
                          className={`px-6 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${
                            activeDomain === Domain.VERBAL 
                              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Verbal
                        </button>
                        <button
                          onClick={() => setActiveDomain(Domain.DI)}
                          className={`px-6 py-4 rounded-[2rem] text-xs font-black uppercase tracking-widest transition-all ${
                            activeDomain === Domain.DI 
                              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Data Insights
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-end mb-5">
                       <span className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Domain Coverage</span>
                       <span className="text-sm font-bold text-slate-400 uppercase">
                          {activeDomain === Domain.QUANT ? '16 Skills' : activeDomain === Domain.VERBAL ? '12 Skills' : '8 Skills'}
                       </span>
                    </div>
                    
                    <div className="h-8 w-full bg-slate-100 rounded-full overflow-hidden flex border border-slate-200/50 mb-12">
                       <div 
                          onClick={() => setActiveZone(SkillStatus.MASTERED)}
                          className={`h-full bg-emerald-500 transition-all duration-700 cursor-pointer hover:opacity-80 ${activeZone === SkillStatus.MASTERED ? 'ring-inset ring-2 ring-white/30' : ''}`} 
                          style={{ width: `${currentDomainData.stats.mastered}%` }} 
                          title="Mastered"
                       />
                       <div 
                          onClick={() => setActiveZone(SkillStatus.LEARNING)}
                          className={`h-full bg-amber-400 transition-all duration-700 cursor-pointer hover:opacity-80 ${activeZone === SkillStatus.LEARNING ? 'ring-inset ring-2 ring-white/30' : ''}`} 
                          style={{ width: `${currentDomainData.stats.learning}%` }} 
                          title="Learning"
                       />
                       <div 
                          onClick={() => setActiveZone(SkillStatus.NOT_READY)}
                          className={`h-full bg-slate-400 transition-all duration-700 cursor-pointer hover:opacity-80 ${activeZone === SkillStatus.NOT_READY ? 'ring-inset ring-2 ring-white/30' : ''}`} 
                          style={{ width: `${currentDomainData.stats.notReady}%` }} 
                          title="Not Ready"
                       />
                    </div>
                    
                    <div className="bg-slate-100 p-2 rounded-[2rem] flex w-full mb-10">
                      {[SkillStatus.MASTERED, SkillStatus.LEARNING, SkillStatus.NOT_READY].map((zone) => (
                        <button 
                          key={zone}
                          onClick={() => setActiveZone(zone)}
                          className={`flex-1 py-5 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
                            activeZone === zone 
                              ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' 
                              : 'text-slate-500 hover:text-slate-900'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full ${currentDomainData.zones[zone].color}`} />
                          {currentDomainData.zones[zone].label}
                        </button>
                      ))}
                    </div>

                    <div className="bg-slate-50 rounded-[3rem] p-10 md:p-12 border border-slate-100 min-h-[300px] mb-12 animate-in fade-in duration-300">
                       <h4 className="text-base font-black text-slate-900 uppercase tracking-widest mb-5 flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${activeData.color}`} />
                          {activeData.label} Zone ({activeData.count} Skills)
                       </h4>
                       <p className="text-slate-600 text-lg font-medium leading-relaxed mb-10">
                          {zoneDescriptions[activeZone]}
                       </p>
                       <div className="grid grid-cols-2 gap-4">
                          {activeData.skills.map((s, i) => (
                            <div key={i} className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border border-slate-200/60 shadow-sm">
                              <span className="text-base font-bold text-slate-700 truncate">{s}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex flex-col gap-6">
                 <button 
                    onClick={handleGeneratePlan}
                    className="w-full bg-slate-900 text-white py-7 rounded-[2.5rem] font-black text-lg uppercase tracking-widest transition-all hover:bg-slate-800 shadow-xl shadow-slate-200"
                 >
                    Generate My Study Plan
                 </button>
                 <button 
                   onClick={() => setWizardStep(1)}
                   className="text-slate-400 text-sm font-black uppercase tracking-widest hover:text-slate-900 transition-colors pb-8"
                 >
                   Back to Score Summary
                 </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticSimulationFlow;