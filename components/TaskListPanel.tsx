import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Task } from '../types';

interface TaskListPanelProps {
  tasks: Task[];
  activeTaskId: string | null;
  onAddTask: (title: string) => void;
  onSelectTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const TaskListPanel: React.FC<TaskListPanelProps> = ({
  tasks,
  activeTaskId,
  onAddTask,
  onSelectTask,
  onDeleteTask,
  onToggleComplete
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      onAddTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg border-2 border-white h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-700 mb-4 fun-font flex items-center gap-2">
        📚 今日作业挑战
      </h2>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mb-6 relative">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="输入作业名称 (例如: 数学练习册)"
          className="w-full pl-4 pr-12 py-3 rounded-2xl border-2 border-indigo-100 focus:border-indigo-400 focus:outline-none bg-indigo-50/50 transition-colors placeholder:text-indigo-300"
        />
        <button
          type="submit"
          className="absolute right-2 top-2 p-1.5 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors"
          disabled={!newTaskTitle.trim()}
        >
          <Plus size={20} />
        </button>
      </form>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {tasks.length === 0 && (
          <div className="text-center text-slate-400 py-8 italic">
            还没有作业哦，快去添加吧！✨
          </div>
        )}
        
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`
              group relative p-4 rounded-2xl border-2 transition-all duration-200
              ${activeTaskId === task.id ? 'border-amber-400 bg-amber-50 shadow-md scale-[1.02]' : 'border-slate-100 bg-white hover:border-indigo-200'}
              ${task.completed ? 'opacity-60 grayscale' : ''}
            `}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(task.id);
                }}
                className={`transition-colors ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-emerald-400'}`}
              >
                {task.completed ? <CheckCircle2 size={24} weight="fill" /> : <Circle size={24} />}
              </button>

              <div 
                className="flex-1 cursor-pointer"
                onClick={() => !task.completed && onSelectTask(task.id)}
              >
                <p className={`font-semibold text-lg ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                  {task.title}
                </p>
                <div className="flex gap-1 mt-1">
                   {Array.from({ length: Math.min(task.sessionsCompleted, 5) }).map((_, i) => (
                     <span key={i} className="text-xs">🍅</span>
                   ))}
                   {task.sessionsCompleted > 5 && <span className="text-xs text-slate-400">+{task.sessionsCompleted - 5}</span>}
                </div>
              </div>

              <button
                onClick={(e) => {
                   e.stopPropagation();
                   onDeleteTask(task.id);
                }}
                className="text-slate-300 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-2"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            {activeTaskId === task.id && !task.completed && (
              <div className="absolute -right-2 -top-2 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm animate-bounce">
                正在进行
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskListPanel;