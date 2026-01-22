import { GOAL_TEMPLATES } from '../utils/templates';
import { cn } from '../utils/cn';

export default function GoalTemplates({ onSelectTemplate, selectedTemplateId = null }) {
    const categories = [...new Set(GOAL_TEMPLATES.map(t => t.category))];

    return (
        <div className="space-y-4">
            <div>
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Quick Templates
                </h3>
                <p className="text-xs text-slate-500 mb-4">
                    Start with a popular goal template or create your own
                </p>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {GOAL_TEMPLATES.map(template => {
                    const isSelected = selectedTemplateId === template.id;

                    return (
                        <button
                            key={template.id}
                            onClick={() => onSelectTemplate(template)}
                            className={cn(
                                "group relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200",
                                "hover:scale-105 active:scale-95 text-left",
                                isSelected
                                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md"
                                    : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800"
                            )}
                        >
                            {/* Selected Indicator */}
                            {isSelected && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs">
                                    ✓
                                </div>
                            )}

                            {/* Icon/Emoji */}
                            <div className="text-4xl mb-2">
                                {template.icon}
                            </div>

                            {/* Name */}
                            <h4 className={cn(
                                "text-sm font-semibold text-center mb-1",
                                isSelected
                                    ? "text-emerald-700 dark:text-emerald-300"
                                    : "text-slate-900 dark:text-white"
                            )}>
                                {template.name}
                            </h4>

                            {/* Amount */}
                            <p className={cn(
                                "text-xs font-medium text-center",
                                isSelected
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : "text-slate-500 dark:text-slate-400"
                            )}>
                                ₹{template.targetAmount.toLocaleString()}
                            </p>

                            {/* Duration */}
                            <p className="text-[10px] text-slate-400 text-center mt-1">
                                {template.durationValue} {template.durationUnit}
                            </p>
                        </button>
                    );
                })}
            </div>

            {/* Category Filter Buttons (Optional Enhancement) */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500">Categories:</span>
                {categories.map(cat => (
                    <span
                        key={cat}
                        className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full"
                    >
                        {cat}
                    </span>
                ))}
            </div>
        </div>
    );
}
