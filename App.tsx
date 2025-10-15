import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { GeneratedImageDisplay } from './components/GeneratedImageDisplay';
import { Spinner } from './components/Spinner';
import { UploadedFile } from './types';
import { generateTryOnImage } from './services/geminiService';

const MAX_JEWELRY_IMAGES = 4;

function App() {
  const [modelImage, setModelImage] = useState<UploadedFile | null>(null);
  const [jewelryImages, setJewelryImages] = useState<UploadedFile[]>([]);
  const [cadImage, setCadImage] = useState<UploadedFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleModelUpload = useCallback((file: File) => {
    setModelImage({ file, previewUrl: URL.createObjectURL(file) });
  }, []);

  const handleJewelryUpload = useCallback((files: File[]) => {
    const newFiles = files.map(file => ({ file, previewUrl: URL.createObjectURL(file) }));
    setJewelryImages(prev => [...prev, ...newFiles].slice(0, MAX_JEWELRY_IMAGES));
  }, []);
  
  const removeJewelryImage = useCallback((index: number) => {
    setJewelryImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleCadUpload = useCallback((file: File) => {
    setCadImage({ file, previewUrl: URL.createObjectURL(file) });
  }, []);
  
  const handleGenerateClick = async () => {
    if (!modelImage || jewelryImages.length === 0) {
      setError("Please upload a model image and at least one jewelry image.");
      return;
    }
    
    setError(null);
    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const result = await generateTryOnImage(modelImage, jewelryImages, cadImage);
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during image generation.");
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerateDisabled = !modelImage || jewelryImages.length === 0 || isLoading;

  return (
    <div className="min-h-screen bg-gold-50 font-sans text-gray-800">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Inputs */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gold-100">
            <div className="space-y-8">
              <ImageUploader
                id="model-uploader"
                title="Model Photo"
                description="Upload a clear photo showing hand, ear, or neck."
                onFileUpload={handleModelUpload}
                file={modelImage}
                onFileRemove={() => setModelImage(null)}
              />
              <ImageUploader
                id="jewelry-uploader"
                title="Jewelry Images"
                description={`Upload 3-4 angle renders of the jewelry. (${jewelryImages.length}/${MAX_JEWELRY_IMAGES})`}
                onFilesUpload={handleJewelryUpload}
                files={jewelryImages}
                onFileRemove={removeJewelryImage}
                multiple
                maxFiles={MAX_JEWELRY_IMAGES}
              />
              <ImageUploader
                id="cad-uploader"
                title="CAD Image (Optional)"
                description="Include height, width, and size details."
                onFileUpload={handleCadUpload}
                file={cadImage}
                onFileRemove={() => setCadImage(null)}
              />
            </div>
             <div className="mt-8 text-center">
              <button
                onClick={handleGenerateClick}
                disabled={isGenerateDisabled}
                className="w-full md:w-auto px-12 py-4 bg-gold-800 text-white font-semibold rounded-lg shadow-md hover:bg-gold-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {isLoading ? <Spinner /> : 'Generate Try-On'}
              </button>
            </div>
            {error && <p className="mt-4 text-center text-red-600">{error}</p>}
          </div>

          {/* Right Column: Output */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gold-100 flex items-center justify-center min-h-[400px] lg:min-h-0">
            <GeneratedImageDisplay
              isLoading={isLoading}
              generatedImage={generatedImage}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
