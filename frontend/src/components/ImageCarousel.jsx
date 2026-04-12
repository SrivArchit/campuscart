import { useState, useRef, useCallback, useEffect } from "react";
import ImageModal from "./ImageModal";

const ImageCarousel = ({ images = [], title = "Product" }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [touchStart, setTouchStart] = useState(null);
  const [slideDirection, setSlideDirection] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const mainImgRef = useRef(null);

  const hasMultiple = images.length > 1;

  const goTo = useCallback(
    (idx, direction = null) => {
      if (isTransitioning || idx === activeIdx) return;
      setSlideDirection(direction || (idx > activeIdx ? "left" : "right"));
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveIdx(idx);
        setTimeout(() => {
          setIsTransitioning(false);
          setSlideDirection(null);
        }, 50);
      }, 150);
    },
    [activeIdx, isTransitioning]
  );

  const goNext = useCallback(() => {
    const next = activeIdx === images.length - 1 ? 0 : activeIdx + 1;
    goTo(next, "left");
  }, [activeIdx, images.length, goTo]);

  const goPrev = useCallback(() => {
    const prev = activeIdx === 0 ? images.length - 1 : activeIdx - 1;
    goTo(prev, "right");
  }, [activeIdx, images.length, goTo]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  // Hover zoom handlers
  const handleMouseMove = (e) => {
    if (!mainImgRef.current) return;
    const rect = mainImgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  // Touch swipe handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
    setTouchStart(null);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
        <span className="text-6xl">📦</span>
      </div>
    );
  }

  // Animation class based on direction
  const getSlideClass = () => {
    if (!isTransitioning) return "opacity-100 translate-x-0";
    if (slideDirection === "left") return "opacity-0 -translate-x-4";
    if (slideDirection === "right") return "opacity-0 translate-x-4";
    return "opacity-100";
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image Container */}
      <div
        ref={mainImgRef}
        className="relative w-full aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-crosshair group border border-gray-100"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Main Image with zoom */}
        <img
          src={images[activeIdx]}
          alt={`${title} - Image ${activeIdx + 1}`}
          className={`w-full h-full transition-all duration-200 ease-out cursor-zoom-in ${getSlideClass()}`}
          style={
            isZoomed
              ? {
                  objectFit: "cover",
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  transform: "scale(2)",
                }
              : { objectFit: "contain" }
          }
          draggable={false}
          onClick={() => setShowModal(true)}
        />

        {/* Prev / Next Arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:text-gray-900 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next image"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}

        {/* Image Counter Badge */}
        {hasMultiple && (
          <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
            {activeIdx + 1} / {images.length}
          </div>
        )}

        {/* Zoom hint */}
        <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block">
          🔍 Click to zoom
        </div>
      </div>

      {/* Dot Indicators (mobile) */}
      {hasMultiple && (
        <div className="flex justify-center gap-1.5 md:hidden">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIdx
                  ? "w-6 h-2 bg-blue-600"
                  : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Thumbnail Strip */}
      {hasMultiple && (
        <div className="hidden md:flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              onMouseEnter={() => goTo(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                i === activeIdx
                  ? "border-blue-600 shadow-md shadow-blue-100 ring-1 ring-blue-300"
                  : "border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400"
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${i + 1}`}
                className="w-full h-full object-cover"
                draggable={false}
              />
              {i === activeIdx && (
                <div className="absolute inset-0 border-2 border-blue-600 rounded-md" />
              )}
            </button>
          ))}
        </div>
      )}
      {/* ✅ Image Zoom Modal */}
      {showModal && (
        <ImageModal
          images={images}
          activeIndex={activeIdx}
          onClose={() => setShowModal(false)}
          onPrev={goPrev}
          onNext={goNext}
          onGoTo={(i) => goTo(i)}
        />
      )}
    </div>
  );
};

export default ImageCarousel;
