import React from 'react';
import { motion } from 'framer-motion';
import { CircleStackIcon } from '@heroicons/react/24/outline'; 

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <CircleStackIcon className="h-10 w-10 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading...</span>
      </motion.div>
    </div>
  );
};

export default Loading;
