function NavigationButtons({ onBack, onNext, showBack, nextLabel = "Next", isLoading = false }) {
  return (
    <div className={`flex ${showBack ? 'justify-between' : 'justify-end'} mt-8 gap-4`}>
      {showBack && (
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
      )}
      <button
        type="submit"
        disabled={isLoading}
        className="px-6 py-2 bg-yellow-400 text-gray-800 rounded hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        {nextLabel}
      </button>
    </div>
  );
}

export default NavigationButtons;