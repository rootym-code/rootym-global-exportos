interface ProgressBarProps {
    currentStep: number;
    totalSteps: number;
    title: string;
  }
  
  export default function ProgressBar({
    currentStep,
    totalSteps,
    title,
  }: ProgressBarProps) {
    const progress = (currentStep / totalSteps) * 100;
  
    return (
      <div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#2E7D32]">
              Export Inquiry
            </p>
  
            <h2 className="mt-1 text-3xl font-bold text-gray-900">
              {title}
            </h2>
          </div>
  
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Step
            </p>
  
            <p className="text-xl font-bold text-[#2E7D32]">
              {currentStep} / {totalSteps}
            </p>
          </div>
        </div>
  
        <div className="mt-8 h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-[#2E7D32] transition-all duration-500"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>
    );
  }