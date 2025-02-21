import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowDownTrayIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';

const PhotoGallery = ({ photos, onClose }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showOriginalSize, setShowOriginalSize] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const galleryRef = useRef(null);

  const handleDownload = async (url) => {
    try {
      setIsDownloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = url.split('/').pop() || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsDownloading(false);
    }
  };

  const handleNext = () => {
    if (photos.length > 1) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }
  };

  const handlePrevious = () => {
    if (photos.length > 1) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
    }
  };

  const toggleOriginalSize = () => {
    setShowOriginalSize((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (galleryRef.current && !galleryRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        ref={galleryRef}
        className={`relative bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full ${showOriginalSize ? 'max-h-full' : 'max-h-screen'} overflow-hidden`}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900 z-10"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        {/* Photo Display */}
        <div className="relative flex flex-col items-center justify-center w-full h-full">
          {photos.length > 0 ? (
            <>
              {/* Navigation Buttons */}
              <button
                onClick={handlePrevious}
                disabled={photos.length <= 1}
                className={`absolute left-4 text-white p-2 rounded-full z-10 ${
                  photos.length > 1 ? 'bg-gray-800 hover:bg-gray-600' : 'bg-gray-400 cursor-not-allowed'
                }`}
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              >
                <ChevronLeftIcon className="w-8 h-8" />
              </button>

              <img
                src={photos[currentPhotoIndex]}
                alt={`Photo ${currentPhotoIndex + 1}`}
                className={`transition-transform ${showOriginalSize ? 'w-auto h-auto' : 'max-w-full max-h-[80vh]'} object-contain`}
                style={{ objectFit: 'contain' }}
              />

              <button
                onClick={handleNext}
                disabled={photos.length <= 1}
                className={`absolute right-4 text-white p-2 rounded-full z-10 ${
                  photos.length > 1 ? 'bg-gray-800 hover:bg-gray-600' : 'bg-gray-400 cursor-not-allowed'
                }`}
                style={{ top: '50%', transform: 'translateY(-50%)' }}
              >
                <ChevronRightIcon className="w-8 h-8" />
              </button>

              {/* Photo Counter */}
              <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full z-10">
                {currentPhotoIndex + 1} / {photos.length}
              </div>
            </>
          ) : (
            <div className="text-gray-500 text-center">
              <p>No photos available</p>
            </div>
          )}
        </div>

        {/* Centered Buttons */}
        {photos.length > 0 && (
          <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-4 z-10">
            <button
              onClick={() => handleDownload(photos[currentPhotoIndex])}
              disabled={isDownloading}
              className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center ${
                isDownloading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
              <span>{isDownloading ? 'Downloading...' : 'Download'}</span>
            </button>
            
            <button
              onClick={toggleOriginalSize}
              className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center"
            >
              {showOriginalSize ? (
                <>
                  <ArrowsPointingInIcon className="w-5 h-5 mr-2" />
                  <span>Show Fit Size</span>
                </>
              ) : (
                <>
                  <ArrowsPointingOutIcon className="w-5 h-5 mr-2" />
                  <span>Show Original Size</span>
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PhotoGallery;

// import React, { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { ArrowDownTrayIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';

// const PhotoGallery = ({ photos, onClose }) => {
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
//   const [showOriginalSize, setShowOriginalSize] = useState(false);
//   const galleryRef = useRef(null);

//   const handleDownload = (url) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = url.split('/').pop();
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleNext = () => {
//     if (photos.length > 1) {
//       setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
//     }
//   };

//   const handlePrevious = () => {
//     if (photos.length > 1) {
//       setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
//     }
//   };

//   const toggleOriginalSize = () => {
//     setShowOriginalSize((prevState) => !prevState);
//   };

//   const handleClickOutside = (event) => {
//     if (galleryRef.current && !galleryRef.current.contains(event.target)) {
//       onClose();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <motion.div
//         ref={galleryRef}
//         className={`relative bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full ${showOriginalSize ? 'max-h-full' : 'max-h-screen'} overflow-hidden`}
//         initial={{ scale: 0.8 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0.8 }}
//         transition={{ duration: 0.3 }}
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900 z-10"
//         >
//           <XMarkIcon className="w-6 h-6" />
//         </button>

//         {/* Photo Display */}
//         <div className="relative flex flex-col items-center justify-center w-full h-full">
//           {photos.length > 0 ? (
//             <>
//               {/* Navigation Buttons */}
//               <button
//                 onClick={handlePrevious}
//                 disabled={photos.length <= 1}
//                 className={`absolute left-4 text-white p-2 rounded-full z-10 ${
//                   photos.length > 1 ? 'bg-gray-800 hover:bg-gray-600' : 'bg-gray-400 cursor-not-allowed'
//                 }`}
//                 style={{ top: '50%', transform: 'translateY(-50%)' }}
//               >
//                 <ChevronLeftIcon className="w-8 h-8" />
//               </button>

//               <img
//                 src={photos[currentPhotoIndex]}
//                 alt={`Photo ${currentPhotoIndex + 1}`}
//                 className={`transition-transform ${showOriginalSize ? 'w-auto h-auto' : 'max-w-full max-h-[80vh]'} object-contain`}
//                 style={{ objectFit: 'contain' }}
//               />

//               <button
//                 onClick={handleNext}
//                 disabled={photos.length <= 1}
//                 className={`absolute right-4 text-white p-2 rounded-full z-10 ${
//                   photos.length > 1 ? 'bg-gray-800 hover:bg-gray-600' : 'bg-gray-400 cursor-not-allowed'
//                 }`}
//                 style={{ top: '50%', transform: 'translateY(-50%)' }}
//               >
//                 <ChevronRightIcon className="w-8 h-8" />
//               </button>

//               {/* Photo Counter */}
//               <div className="absolute top-4 left-4 bg-gray-800 text-white px-3 py-1 rounded-full z-10">
//                 {currentPhotoIndex + 1} / {photos.length}
//               </div>
//             </>
//           ) : (
//             <div className="text-gray-500 text-center">
//               <p>No photos available</p>
//             </div>
//           )}
//         </div>

//         {/* Centered Buttons */}
//         {photos.length > 0 && (
//           <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-4 z-10">
//             <button
//               onClick={() => handleDownload(photos[currentPhotoIndex])}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
//             >
//               <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
//               <span>Download</span>
//             </button>
            
//             <button
//               onClick={toggleOriginalSize}
//               className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center"
//             >
//               {showOriginalSize ? (
//                 <>
//                   <ArrowsPointingInIcon className="w-5 h-5 mr-2" />
//                   <span>Show Fit Size</span>
//                 </>
//               ) : (
//                 <>
//                   <ArrowsPointingOutIcon className="w-5 h-5 mr-2" />
//                   <span>Show Original Size</span>
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// };

// export default PhotoGallery;





// import React, { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { ArrowDownTrayIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';

// const PhotoGallery = ({ photos, onClose }) => {
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
//   const [showOriginalSize, setShowOriginalSize] = useState(false);
//   const galleryRef = useRef(null);

//   const handleDownload = (url) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = url.split('/').pop(); // Filename from URL
//     link.click(); // Trigger download
//   };

//   const handleNext = () => {
//     setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
//   };

//   const handlePrevious = () => {
//     setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
//   };

//   const toggleOriginalSize = () => {
//     setShowOriginalSize((prevState) => !prevState);
//   };

//   const handleClickOutside = (event) => {
//     if (galleryRef.current && !galleryRef.current.contains(event.target)) {
//       onClose();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <motion.div
//         ref={galleryRef}
//         className={`relative bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full ${showOriginalSize ? 'max-h-full' : 'max-h-[80vh]'} overflow-hidden`}
//         initial={{ scale: 0.8 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0.8 }}
//         transition={{ duration: 0.3 }}
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900 z-10"
//         >
//           <XMarkIcon className="w-6 h-6" />
//         </button>

//         {/* Photo Display */}
//         {photos.length > 0 ? (
//           <div className="relative flex flex-col items-center justify-center w-full h-full">
//             {/* Navigation Buttons */}
//             <button
//               onClick={handlePrevious}
//               disabled={photos.length <= 1}
//               className="absolute left-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600 z-10"
//               style={{ top: '50%', transform: 'translateY(-50%)' }}
//             >
//               <ChevronLeftIcon className="w-8 h-8" />
//             </button>

//             <img
//               src={photos[currentPhotoIndex]}
//               alt={`Photo ${currentPhotoIndex + 1}`}
//               className={`transition-transform ${showOriginalSize ? 'w-auto h-auto' : 'max-w-full max-h-[80vh]'} object-contain`}
//               style={{ objectFit: 'contain' }}
//             />

//             <button
//               onClick={handleNext}
//               disabled={photos.length <= 1}
//               className="absolute right-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600 z-10"
//               style={{ top: '50%', transform: 'translateY(-50%)' }}
//             >
//               <ChevronRightIcon className="w-8 h-8" />
//             </button>
//           </div>
//         ) : (
//           <div className="text-gray-500 text-center">
//             <p>No photos available</p>
//           </div>
//         )}

//         {/* Centered Buttons */}
//         {photos.length > 0 && (
//           <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-4 z-10">
//             <button
//               onClick={() => handleDownload(photos[currentPhotoIndex])}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
//             >
//               <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
//               <span>Download</span>
//             </button>
            
//             <button
//               onClick={toggleOriginalSize}
//               className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center"
//             >
//               {showOriginalSize ? (
//                 <>
//                   <ArrowsPointingInIcon className="w-5 h-5 mr-2" />
//                   <span>Show Fit Size</span>
//                 </>
//               ) : (
//                 <>
//                   <ArrowsPointingOutIcon className="w-5 h-5 mr-2" />
//                   <span>Show Original Size</span>
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// };

// export default PhotoGallery;


// import React, { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { ArrowDownTrayIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon } from '@heroicons/react/24/outline';

// const PhotoGallery = ({ photos, onClose }) => {
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
//   const [showOriginalSize, setShowOriginalSize] = useState(false);
//   const galleryRef = useRef(null);

//   const handleDownload = (url) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = url.split('/').pop();
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleNext = () => {
//     setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
//   };

//   const handlePrevious = () => {
//     setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
//   };

//   const toggleOriginalSize = () => {
//     setShowOriginalSize((prevState) => !prevState);
//   };

//   const handleClickOutside = (event) => {
//     if (galleryRef.current && !galleryRef.current.contains(event.target)) {
//       onClose();
//     }
//   };

//   useEffect(() => {
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <motion.div
//         ref={galleryRef}
//         className={`relative bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full ${showOriginalSize ? 'max-h-full' : 'max-h-screen'} overflow-hidden`}
//         initial={{ scale: 0.8 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0.8 }}
//         transition={{ duration: 0.3 }}
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900 z-10"
//         >
//           <XMarkIcon className="w-6 h-6" />
//         </button>

//         {/* Photo Display */}
//         {photos.length > 0 ? (
//           <div className="relative flex flex-col items-center justify-center w-full h-full">
//             {/* Navigation Buttons */}
//             <button
//               onClick={handlePrevious}
//               disabled={photos.length <= 1}
//               className="absolute left-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600 z-10"
//               style={{ top: '50%', transform: 'translateY(-50%)' }}
//             >
//               <ChevronLeftIcon className="w-8 h-8" />
//             </button>

//             <img
//               src={photos[currentPhotoIndex]}
//               alt={`Photo ${currentPhotoIndex + 1}`}
//               className={`transition-transform ${showOriginalSize ? 'w-auto h-auto' : 'max-w-full max-h-[80vh]'} object-contain`}
//               style={{ objectFit: 'contain' }}
//             />

//             <button
//               onClick={handleNext}
//               disabled={photos.length <= 1}
//               className="absolute right-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600 z-10"
//               style={{ top: '50%', transform: 'translateY(-50%)' }}
//             >
//               <ChevronRightIcon className="w-8 h-8" />
//             </button>
//           </div>
//         ) : (
//           <div className="text-gray-500 text-center">
//             <p>No photos available</p>
//           </div>
//         )}

//         {/* Centered Buttons */}
//         {photos.length > 0 && (
//           <div className="absolute bottom-4 inset-x-0 flex justify-center space-x-4 z-10">
//             <button
//               onClick={() => handleDownload(photos[currentPhotoIndex])}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
//             >
//               <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
//               <span>Download</span>
//             </button>
            
//             <button
//               onClick={toggleOriginalSize}
//               className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center"
//             >
//               {showOriginalSize ? (
//                 <>
//                   <ArrowsPointingInIcon className="w-5 h-5 mr-2" />
//                   <span>Show Fit Size</span>
//                 </>
//               ) : (
//                 <>
//                   <ArrowsPointingOutIcon className="w-5 h-5 mr-2" />
//                   <span>Show Original Size</span>
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// };

// export default PhotoGallery;




///################################################### for only downloading
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { ArrowDownTrayIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// const PhotoGallery = ({ photos, onClose }) => {
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

//   const handleDownload = (url) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = url.split('/').pop();
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleNext = () => {
//     setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
//   };

//   const handlePrevious = () => {
//     setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
//   };

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <motion.div
//         className="relative bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-hidden"
//         initial={{ scale: 0.8 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0.8 }}
//         transition={{ duration: 0.3 }}
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900 z-10"
//         >
//           <XMarkIcon className="w-6 h-6" />
//         </button>

//         {/* Photo Display */}
//         {photos.length > 0 ? (
//           <div className="relative flex justify-center items-center w-full h-full">
//             {/* Navigation Buttons */}
//             <button
//               onClick={handlePrevious}
//               disabled={photos.length <= 1}
//               className="absolute left-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600 z-10"
//               style={{ top: '50%', transform: 'translateY(-50%)' }}
//             >
//               <ChevronLeftIcon className="w-8 h-8" />
//             </button>
            
//             <img
//               src={photos[currentPhotoIndex]}
//               alt={`Photo ${currentPhotoIndex + 1}`}
//               className="max-w-full max-h-[80vh] object-contain"
//               style={{ objectFit: 'contain' }}
//             />
            
//             <button
//               onClick={handleNext}
//               disabled={photos.length <= 1}
//               className="absolute right-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600 z-10"
//               style={{ top: '50%', transform: 'translateY(-50%)' }}
//             >
//               <ChevronRightIcon className="w-8 h-8" />
//             </button>
//           </div>
//         ) : (
//           <div className="text-gray-500 text-center">
//             <p>No photos available</p>
//           </div>
//         )}
        
//         {/* Download Button */}
//         {photos.length > 0 && (
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
//             <button
//               onClick={() => handleDownload(photos[currentPhotoIndex])}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
//             >
//               <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
//               <span>Download</span>
//             </button>
//           </div>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// };

// export default PhotoGallery;



// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { ArrowDownTrayIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'; // Import necessary icons

// const PhotoGallery = ({ photos, onClose }) => {
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

//   const handleDownload = (url) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = url.split('/').pop();
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleNext = () => {
//     setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
//   };

//   const handlePrevious = () => {
//     setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
//   };

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <motion.div
//         className="relative bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full h-full max-h-full overflow-hidden"
//         initial={{ scale: 0.8 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0.8 }}
//         transition={{ duration: 0.3 }}
//       >
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 bg-gray-700 text-white p-2 rounded-full hover:bg-gray-900"
//         >
//           <XMarkIcon className="w-6 h-6" />
//         </button>
        
//         {/* Photo Display */}
//         {photos.length > 0 ? (
//           <div className="relative flex justify-center items-center h-full w-full">
//             {/* Navigation Buttons */}
//             <button
//               onClick={handlePrevious}
//               disabled={photos.length <= 1}
//               className="absolute left-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600"
//               style={{ top: '50%', transform: 'translateY(-50%)' }}
//             >
//               <ChevronLeftIcon className="w-8 h-8" />
//             </button>
            
//             <img
//               src={photos[currentPhotoIndex]}
//               alt={`Photo ${currentPhotoIndex + 1}`}
//               className="w-full h-auto max-h-screen object-contain"
//             />
            
//             <button
//               onClick={handleNext}
//               disabled={photos.length <= 1}
//               className="absolute right-4 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-600"
//               style={{ top: '50%', transform: 'translateY(-50%)' }}
//             >
//               <ChevronRightIcon className="w-8 h-8" />
//             </button>
//           </div>
//         ) : (
//           <div className="text-gray-500 text-center">
//             <p>No photos available</p>
//           </div>
//         )}
        
//         {/* Download Button */}
//         {photos.length > 0 && (
//           <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
//             <button
//               onClick={() => handleDownload(photos[currentPhotoIndex])}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
//             >
//               <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
//               <span>Download</span>
//             </button>
//           </div>
//         )}
//       </motion.div>
//     </motion.div>
//   );
// };

// export default PhotoGallery;





// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'; // Heroicons for download button

// const PhotoGallery = ({ photos, onClose }) => {
//   const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

//   const handleDownload = (url) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = url.split('/').pop();
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const handleNext = () => {
//     setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
//   };

//   const handlePrevious = () => {
//     setCurrentPhotoIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
//   };

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <motion.div
//         className="bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full relative"
//         initial={{ scale: 0.8 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0.8 }}
//         transition={{ duration: 0.3 }}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//           </svg>
//         </button>
//         <div className="flex items-center justify-center relative">
//           {photos.length > 0 ? (
//             <img
//               src={photos[currentPhotoIndex]}
//               alt={`Photo ${currentPhotoIndex + 1}`}
//               className="w-full h-auto max-h-96 object-cover rounded-lg shadow-md"
//             />
//           ) : (
//             <div className="text-gray-500 text-center">
//               <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12l5 5L20 5M2 12l5-5 13 13M2 12l5 5m13-13L2 12l13 13m0-13l5 5-13 13m0-13l5-5m0 13L20 12M12 6l5 5L17 6m-7 0l5 5-5 5m0-10l5 5m-5-5L7 6l5-5"></path>
//               </svg>
//               <p>No photos available</p>
//             </div>
//           )}
//           <button
//             onClick={handlePrevious}
//             disabled={photos.length <= 1}
//             className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
//           >
//             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
//             </svg>
//           </button>
//           <button
//             onClick={handleNext}
//             disabled={photos.length <= 1}
//             className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800"
//           >
//             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//             </svg>
//           </button>
//         </div>
//         <div className="mt-4 flex justify-center space-x-4">
//           <button
//             onClick={() => handleDownload(photos[currentPhotoIndex])}
//             className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-lg flex items-center"
//           >
//             <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
//             <span>Download</span>
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default PhotoGallery;


// import React from 'react';
// import { motion } from 'framer-motion';

// const PhotoGallery = ({ photos, onClose }) => {
//   const handleDownload = (url) => {
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = url.split('/').pop();
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <motion.div
//       className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ duration: 0.3 }}
//     >
//       <motion.div
//         className="bg-white p-4 rounded-lg shadow-lg max-w-4xl w-full relative"
//         initial={{ scale: 0.8 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0.8 }}
//         transition={{ duration: 0.3 }}
//       >
//         <button
//           onClick={onClose}
//           className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
//         >
//           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//           </svg>
//         </button>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//           {photos.map((photo, index) => (
//             <motion.div
//               key={index}
//               className="relative group"
//               whileHover={{ scale: 1.05 }}
//               transition={{ duration: 0.2 }}
//             >
//               <img
//                 src={photo}
//                 alt={`Photo ${index + 1}`}
//                 className="w-full h-40 object-cover rounded-lg shadow-md"
//               />
//               <motion.div
//                 className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                 whileHover={{ opacity: 1 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 <button
//                   onClick={() => handleDownload(photo)}
//                   className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-lg"
//                 >
//                   Download
//                 </button>
//               </motion.div>
//             </motion.div>
//           ))}
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default PhotoGallery;
