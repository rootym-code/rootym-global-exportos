interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isNextDisabled?: boolean;
}

export default function NavigationButtons({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  isNextDisabled = false,
}: NavigationButtonsProps) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="mt-12 flex items-center justify-between border-t border-gray-200 pt-8">
      <button
        type="button"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="rounded-xl border border-gray-300 px-8 py-3 font-medium text-gray-700 transition-all duration-200 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <button
        type="button"
        onClick={onNext}
        disabled={isNextDisabled}
        className={`rounded-xl px-8 py-3 font-semibold text-white transition-all duration-200 ${
          isNextDisabled
            ? "cursor-not-allowed bg-gray-400"
            : "bg-[#2E7D32] hover:bg-[#256428]"
        }`}
      >
        {isLastStep ? "Review & Submit" : "Next"}
      </button>
    </div>
  );
}