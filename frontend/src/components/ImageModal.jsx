import { useEffect } from "react";

const ImageModal = ({ images, activeIndex, onClose, onPrev, onNext, onGoTo }) => {
  // ✅ Close on Escape key, navigate with arrows
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onPrev, onNext]);

  // ✅ Prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center px-4"
      onClick={onClose}
    >
      {/* Modal Content — stop click from closing */}
      <div
        className="relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white text-3xl hover:text-gray-300 transition z-10"
        >
          ✕
        </button>

        {/* Main Zoomed Image */}
        <div className="relative rounded-xl overflow-hidden bg-black">
          <img
            src={images[activeIndex]}
            alt={`zoom-${activeIndex}`}
            className="w-full max-h-[75vh] object-contain"
          />

          {/* Prev / Next Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={onPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl transition"
              >
                ‹
              </button>

              <button
                onClick={onNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl transition"
              >
                ›
              </button>
            </>
          )}

          {/* Counter */}
          {images.length > 1 && (
            <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
              {activeIndex + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Thumbnails in Modal */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 justify-center flex-wrap">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`thumb-${i}`}
                onClick={() => onGoTo(i)}
                className={`h-14 w-14 object-cover rounded-lg cursor-pointer border-2 transition ${
                  activeIndex === i
                    ? "border-white opacity-100"
                    : "border-transparent opacity-50 hover:opacity-80"
                }`}
              />
            ))}
          </div>
        )}

        {/* Keyboard hint */}
        <p className="text-center text-gray-500 text-xs mt-3">
          Press ← → to navigate • Esc to close
        </p>
      </div>
    </div>
  );
};

export default ImageModal;
