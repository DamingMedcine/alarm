import React, { useState, useEffect, useCallback, useRef } from 'react';
import TimerDisplay from './components/TimerDisplay';
import TaskListPanel from './components/TaskListPanel';
import Companion from './components/Companion';
import { Task, TimerMode, CompanionState, FOCUS_TIME, SHORT_BREAK_TIME, LONG_BREAK_TIME } from './types';
import { getEncouragement, getBreakContent } from './services/geminiService';

const App: React.FC = () => {
  // --- State ---
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  
  const [mode, setMode] = useState<TimerMode>(TimerMode.FOCUS);
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);
  const [isActive, setIsActive] = useState(false);
  const [totalTime, setTotalTime] = useState(FOCUS_TIME);

  const [companion, setCompanion] = useState<CompanionState>({
    message: "你好呀！我是你的作业小助手。添加一个任务，我们开始吧！",
    emotion: 'happy',
    isLoading: false
  });

  // Audio context for beep sound
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBeep = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
    
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.5);
  };

  // --- Timer Logic ---
  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer Finished
      setIsActive(false);
      playBeep();
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleTimerComplete = () => {
    if (mode === TimerMode.FOCUS) {
      // Finished Focus
      if (activeTaskId) {
        setTasks(prev => prev.map(t => 
          t.id === activeTaskId ? { ...t, sessionsCompleted: t.sessionsCompleted + 1 } : t
        ));
      }
      triggerBreakAI();
      // Auto switch to short break (can be improved to prompt user)
      setTimerMode(TimerMode.SHORT_BREAK);
    } else {
      // Finished Break
      setCompanion({
        message: "休息结束啦！准备好迎接下一个挑战了吗？",
        emotion: 'happy',
        isLoading: false
      });
      setTimerMode(TimerMode.FOCUS);
    }
  };

  const setTimerMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsActive(false);
    switch (newMode) {
      case TimerMode.FOCUS:
        setTimeLeft(FOCUS_TIME);
        setTotalTime(FOCUS_TIME);
        break;
      case TimerMode.SHORT_BREAK:
        setTimeLeft(SHORT_BREAK_TIME);
        setTotalTime(SHORT_BREAK_TIME);
        break;
      case TimerMode.LONG_BREAK:
        setTimeLeft(LONG_BREAK_TIME);
        setTotalTime(LONG_BREAK_TIME);
        break;
    }
  };

  // --- AI Interaction ---
  const triggerFocusAI = async (taskName: string) => {
    setCompanion(prev => ({ ...prev, isLoading: true, emotion: 'thinking' }));
    const msg = await getEncouragement(taskName);
    setCompanion({
      message: msg,
      emotion: 'happy',
      isLoading: false
    });
  };

  const triggerBreakAI = async () => {
    setCompanion(prev => ({ ...prev, isLoading: true, emotion: 'celebrating' }));
    const msg = await getBreakContent();
    setCompanion({
      message: msg,
      emotion: 'celebrating',
      isLoading: false
    });
  };

  // --- Task Handlers ---
  const addTask = (title: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      sessionsCompleted: 0
    };
    setTasks(prev => [...prev, newTask]);
    // If it's the first task, select it automatically
    if (tasks.length === 0) {
        selectTask(newTask.id, title);
    }
  };

  const selectTask = (id: string, title?: string) => {
    // Cannot switch tasks if timer is running in focus mode
    if (isActive && mode === TimerMode.FOCUS) {
        alert("请先暂停当前番茄钟再切换任务哦！");
        return;
    }

    setActiveTaskId(id);
    const taskTitle = title || tasks.find(t => t.id === id)?.title || "作业";
    
    // Switch to focus mode if not already
    setTimerMode(TimerMode.FOCUS);
    
    // Trigger AI encouragement
    triggerFocusAI(taskTitle);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
    if (activeTaskId === id) {
        setActiveTaskId(null);
        setIsActive(false);
        setCompanion({
            message: "太棒了！这个任务完成啦！🎉",
            emotion: 'celebrating',
            isLoading: false
        });
    }
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (activeTaskId === id) {
        setActiveTaskId(null);
        setIsActive(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl fun-font text-indigo-600 drop-shadow-sm flex items-center gap-2">
            🍅 趣学番茄钟
        </h1>
        <div className="text-sm bg-white/50 px-3 py-1 rounded-full text-indigo-400 font-bold">
            FunFocus for Kids
        </div>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Timer & Companion */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-[2rem] shadow-xl border-4 border-indigo-100 overflow-hidden relative">
             <div className="absolute top-0 w-full h-2 bg-gradient-to-r from-indigo-400 via-rose-400 to-amber-400"></div>
             <TimerDisplay 
                timeLeft={timeLeft} 
                totalTime={totalTime} 
                isActive={isActive}
                mode={mode}
                onToggle={() => {
                    if (!activeTaskId && mode === TimerMode.FOCUS) {
                        setCompanion({ message: "请先选择一个作业任务再开始哦！👇", emotion: 'thinking', isLoading: false });
                        return;
                    }
                    setIsActive(!isActive);
                }}
                onReset={() => {
                    setIsActive(false);
                    setTimerMode(mode);
                }}
             />
          </div>
          
          <Companion state={companion} />
        </div>

        {/* Right Column: Tasks */}
        <div className="h-[500px] md:h-auto">
          <TaskListPanel 
            tasks={tasks}
            activeTaskId={activeTaskId}
            onAddTask={addTask}
            onSelectTask={(id) => selectTask(id)}
            onDeleteTask={deleteTask}
            onToggleComplete={toggleTaskComplete}
          />
        </div>
      </main>

      {/* Footer / Background decorations */}
      <div className="fixed bottom-0 left-0 w-full pointer-events-none -z-10 overflow-hidden h-screen">
          <div className="absolute bottom-10 left-10 text-6xl opacity-10 rotate-12">✏️</div>
          <div className="absolute top-20 right-20 text-8xl opacity-10 -rotate-12">📚</div>
          <div className="absolute bottom-40 right-10 text-6xl opacity-10 rotate-45">🎨</div>
      </div>
    </div>
  );
};

export default App;