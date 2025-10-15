import React from 'react';
import { Spinner } from './Spinner';
import { DownloadIcon, SparklesIcon } from './Icons';

interface GeneratedImageDisplayProps {
  isLoading: boolean;
  generatedImage: string | null;
}

export const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({ isLoading, generatedImage }) => {
  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = 'hannie-ai-try-on.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="flex justify-center mb-4">
            <Spinner large />
        </div>
        <h3 className="text-lg font-semibold text-gold-800">Generating Your Virtual Try-On...</h3>
        <p className="text-sm text-gray-500">This may take a moment. The AI is working its magic!</p>
      </div>
    );
  }

  if (generatedImage) {
    return (
      <div className="w-full">
        <div className="relative group w-full aspect-square rounded-lg overflow-hidden shadow-lg border border-gold-200">
          <img src={generatedImage} alt="Generated try-on" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-6 py-3 bg-white/90 text-gold-900 font-bold rounded-lg hover:bg-white transition-all transform hover:scale-105"
            >
              <DownloadIcon className="w-5 h-5" />
              Download
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center text-gray-400">
      <SparklesIcon className="w-16 h-16 mx-auto text-gold-300" />
      <h3 className="mt-4 text-lg font-medium text-gray-700">Your Generated Image Will Appear Here</h3>
      <p className="mt-1 text-sm">Upload images and click "Generate" to begin.</p>
    </div>
  );
};
