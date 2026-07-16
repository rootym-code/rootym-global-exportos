interface NavigationButtonsProps {
    currentStep: number;
    totalSteps: number;
    onPrevious: () => void;
    onNext: () => void;
  }
  
  export default function NavigationButtons({
    currentStep,
    totalSteps,
    onPrevious,
    onNext,
  }: NavigationButtonsProps) {
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;
  
    return (
      <div className="mt-12 flex items-center justify-between border-t pt-8">
        <button
          type="button"
          onClick={onPrevious}
          disabled={isFirstStep}
          className="rounded-xl border border-gray-300 px-8 py-3 font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
  
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-[#2E7D32] px-8 py-3 font-semibold text-white transition hover:bg-[#256428]"
        >
          {isLastStep ? "Review & Submit" : "Next"}
        </button>
      </div>
    );
  }