import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import CanvasPreview from './components/CanvasPreview';
import { CONFIG } from './constants';
import { FormState } from './types';

// Declare html2canvas manually since we are using CDN and no @types/html2canvas
declare const html2canvas: any;

function App() {
  const [formState, setFormState] = useState<FormState>({
    logo: null,
    modelCode: '',
    brandName: CONFIG.brandName,
    websiteUrl: 'www.yourbrand.com',
    selectedCategoryId: CONFIG.categories[0].id,
    selectedSizes: [], // Start empty to force user selection
    measurements: {},
    fabricValues: {},
    canvasFormat: 'portrait' // Default format
  });
  
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Auto-load logo.png if it exists in the root folder
  useEffect(() => {
    const loadDefaultLogo = async () => {
      try {
        const response = await fetch('./logo.png');
        if (response.ok) {
          const blob = await response.blob();
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormState(prev => {
              // Only set if user hasn't already uploaded one manually (though this runs on mount)
              if (!prev.logo) {
                return { ...prev, logo: reader.result as string };
              }
              return prev;
            });
          };
          reader.readAsDataURL(blob);
        }
      } catch (error) {
        // Silent fail if file doesn't exist, just use text fallback
        console.log("No default logo.png found, using text fallback.");
      }
    };

    loadDefaultLogo();
  }, []);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    
    setIsDownloading(true);

    try {
      // Logic to capture high res image
      const element = previewRef.current;
      
      // Determine target width based on format
      // Portrait: 1200x1800
      // Landscape: 1800x1200
      const targetWidth = formState.canvasFormat === 'landscape' ? 1800 : 1200;
      
      // Calculate scale factor
      const scaleFactor = targetWidth / element.offsetWidth;

      const canvas = await html2canvas(element, {
        scale: scaleFactor,
        useCORS: true, // Important for external images
        allowTaint: true,
        backgroundColor: '#ffffff', // Ensure white background
        logging: false,
        imageTimeout: 0,
      });

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95); // High quality JPG
      
      // Create download link
      const filename = formState.modelCode 
        ? `Size-Chart-${formState.modelCode}-${formState.canvasFormat}.jpg` 
        : `Size-Chart-${formState.selectedCategoryId}-${formState.canvasFormat}.jpg`;
        
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Image generation failed:", error);
      alert("Görsel oluşturulurken bir hata oluştu.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen overflow-hidden">
      
      {/* Sidebar Control Panel */}
      <Sidebar 
        config={CONFIG}
        formState={formState}
        setFormState={setFormState}
        onDownload={handleDownload}
        isDownloading={isDownloading}
      />

      {/* Preview Area */}
      <CanvasPreview 
        config={CONFIG}
        formState={formState}
        setFormState={setFormState}
        previewRef={previewRef}
      />
      
    </div>
  );
}

export default App;