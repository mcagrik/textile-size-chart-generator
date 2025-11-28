import React from 'react';
import { AppConfig, FormState } from '../types';

interface CanvasPreviewProps {
  config: AppConfig;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  previewRef: React.RefObject<HTMLDivElement>;
}

const CanvasPreview: React.FC<CanvasPreviewProps> = ({ config, formState, setFormState, previewRef }) => {
  const currentCategory = config.categories.find(c => c.id === formState.selectedCategoryId) || config.categories[0];
  const activeSizes = formState.selectedSizes;
  const hasSizes = activeSizes.length > 0;
  const isLandscape = formState.canvasFormat === 'landscape';
  
  return (
    <div className="flex-1 bg-gray-200 overflow-hidden flex flex-col relative">
      
      {/* Format Toggle Toolbar */}
      <div className="h-14 bg-white border-b border-gray-300 flex items-center justify-center gap-4 shadow-sm shrink-0 z-20">
         <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Canvas Formatı:</span>
         
         <button 
           onClick={() => setFormState(prev => ({ ...prev, canvasFormat: 'portrait' }))}
           className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
             !isLandscape 
               ? 'bg-black text-white shadow-md' 
               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
           }`}
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
           </svg>
           Dikey (1200x1800)
         </button>

         <button 
           onClick={() => setFormState(prev => ({ ...prev, canvasFormat: 'landscape' }))}
           className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
             isLandscape 
               ? 'bg-black text-white shadow-md' 
               : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
           }`}
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
           </svg>
           Yatay (1800x1200)
         </button>
      </div>

      <div className="flex-1 overflow-auto p-8 flex items-start justify-center">
        {/* 
          Container representing the target ratio. 
          Ratio 2:3 (Portrait) or 3:2 (Landscape).
          
          We set a base width for CSS rendering:
          Portrait: 800px (Output will be x1.5 -> 1200)
          Landscape: 1000px (Output will be x1.8 -> 1800)
        */}
        <div 
          ref={previewRef}
          id="capture-target"
          className="relative bg-white shadow-2xl overflow-hidden flex flex-col origin-top"
          style={{
            width: isLandscape ? '1000px' : '800px', 
            aspectRatio: isLandscape ? '3/2' : '2/3',
            fontFamily: "'Poppins', sans-serif" 
          }}
        >
          {/* Header Section */}
          <header className={`${isLandscape ? 'h-28 px-10' : 'h-36 px-10'} border-b-4 border-black flex justify-between items-center bg-white z-10 shrink-0 transition-all`}>
            <div className="flex-1 flex flex-col justify-center h-full">
               {/* Logo Container */}
               <div className={`${isLandscape ? 'h-16' : 'h-20'} flex items-center justify-start overflow-hidden mb-1 transition-all`}>
                  {formState.logo ? (
                      <img 
                        src={formState.logo} 
                        alt="Logo" 
                        className="max-h-[60px] w-auto object-contain max-w-[300px]" 
                      />
                  ) : (
                      <h1 className="text-5xl font-extrabold tracking-widest text-black uppercase truncate">
                        {formState.brandName}
                      </h1>
                  )}
               </div>
              <h2 className={`${isLandscape ? 'text-lg' : 'text-xl'} text-gray-500 tracking-wide uppercase`}>
                {currentCategory.label} BEDEN TABLOSU
              </h2>
            </div>
            
            {/* Model Code Display */}
            <div className="flex flex-col items-end justify-center ml-6">
              <span className="text-sm text-gray-500 font-bold tracking-wider uppercase mb-1">MODEL KODU</span>
              <span className="text-4xl font-black text-black tracking-tight leading-none">
                  {formState.modelCode || '-'}
              </span>
            </div>
          </header>

          {/* Main Content Area - Responsive Layout based on format */}
          {isLandscape ? (
            /* LANDSCAPE LAYOUT */
            <main className="flex-1 p-8 flex flex-row gap-8 relative overflow-hidden">
               {/* Left Column: Table & Specs */}
               <div className="w-[65%] flex flex-col gap-6 h-full min-h-0">
                  {/* Size Table */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
                    <table className="w-full text-center border-collapse">
                      <thead>
                        <tr className="bg-black text-white">
                          <th className="py-3 px-3 font-semibold text-base uppercase tracking-wider text-left pl-4 border-r border-gray-700 whitespace-nowrap">Ölçüler (cm)</th>
                          {hasSizes ? activeSizes.map(size => (
                            <th key={size} className="py-3 px-1 font-bold text-base border-l border-gray-700">
                              {size}
                            </th>
                          )) : (
                            <th className="py-3 px-2 italic font-normal text-gray-400">Beden Seçiniz</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {currentCategory.measurements.map((measurement, idx) => (
                          <tr key={measurement} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="py-2.5 px-3 text-left pl-4 font-semibold text-gray-800 text-base border-r border-gray-200">
                              {measurement}
                            </td>
                            {hasSizes && activeSizes.map(size => (
                              <td key={size} className="py-2.5 px-1 text-gray-700 font-medium text-base border-l border-gray-100">
                                {formState.measurements[size]?.[measurement] || '-'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Fabric/Product Specs */}
                  <div className="flex-1 bg-zinc-900 text-white p-5 rounded-xl shadow-lg flex flex-col overflow-hidden justify-center">
                    <h3 className="text-base font-bold border-b border-gray-600 pb-2 mb-3 uppercase tracking-wider shrink-0">
                      Ürün Özellikleri
                    </h3>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                      {currentCategory.fabricProperties.map(prop => {
                         const val = formState.fabricValues[prop];
                         if (!val) return null;
                         return (
                           <div key={prop} className="flex flex-col border-b border-zinc-800 pb-1">
                             <span className="text-[10px] text-gray-400 uppercase tracking-wide truncate">{prop}</span>
                             <span className="font-medium text-sm text-gray-100 truncate">{val}</span>
                           </div>
                         );
                      })}
                      {Object.keys(formState.fabricValues).length === 0 && (
                        <p className="text-gray-500 italic text-sm col-span-3">Özellik bilgisi girilmedi.</p>
                      )}
                    </div>
                  </div>
               </div>

               {/* Right Column: Image & Disclaimer */}
               <div className="w-[35%] flex flex-col gap-4 h-full">
                  {/* Image Container */}
                  <div className="flex-1 relative flex items-center justify-center overflow-hidden min-h-0 border border-dashed border-gray-400 rounded-lg bg-white">
                      {currentCategory.silhouetteImage ? (
                        <img 
                        src={currentCategory.silhouetteImage} 
                        alt="Model Siluet" 
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain mix-blend-multiply opacity-95 p-1"
                        />
                      ) : (
                        <div className="w-full h-full text-gray-400 flex flex-col items-center justify-center bg-gray-50">
                          <span>Görsel Yok</span>
                        </div>
                      )}
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-gray-100 p-3 rounded-lg border-l-4 border-black shrink-0">
                    <p className="text-[10px] text-gray-600 leading-relaxed">
                      <strong>Not:</strong> Üretim toleransı nedeniyle ölçülerde +/- 1-2 cm farklılık olabilir.
                    </p>
                  </div>
               </div>
            </main>
          ) : (
            /* PORTRAIT LAYOUT: Dynamic Flex Stack */
            /* Using flex-col with min-h-0 ensures the middle section shrinks if the table grows */
            <main className="flex-1 p-10 flex flex-col gap-6 relative overflow-hidden">
              
              {/* Size Table - Allow it to grow, but don't let it shrink below content */}
              {/* Added whitespace-nowrap to headers to prevent 'cm' wrapping */}
              <div className="relative z-10 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
                <table className="w-full text-center border-collapse">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="py-4 px-6 font-bold text-lg uppercase tracking-wider text-left pl-8 border-r border-gray-700 whitespace-nowrap">Ölçüler (cm)</th>
                      {hasSizes ? activeSizes.map(size => (
                        <th key={size} className="py-4 px-2 font-bold text-lg border-l border-gray-700 w-[10%]">
                          {size}
                        </th>
                      )) : (
                        <th className="py-4 px-4 italic font-normal text-gray-400">Beden Seçiniz</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {currentCategory.measurements.map((measurement, idx) => (
                      <tr key={measurement} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="py-4 px-6 text-left pl-8 font-semibold text-gray-800 text-lg border-r border-gray-200">
                          {measurement}
                        </td>
                        {hasSizes && activeSizes.map(size => (
                          <td key={size} className="py-4 px-2 text-gray-700 font-medium text-lg border-l border-gray-100">
                            {formState.measurements[size]?.[measurement] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Middle Section: Image & Fabric Info */}
              {/* flex-1 and min-h-0 are crucial here. They allow this container to shrink to fit remaining space */}
              <div className="flex flex-row gap-8 flex-1 relative z-10 min-h-0 items-stretch">
                
                {/* Fabric Properties Card (40%) - Allow scrolling if absolutely necessary, but usually fits */}
                <div className="w-2/5 flex flex-col gap-4 overflow-y-auto pr-1">
                  <div className="bg-zinc-900 text-white p-6 rounded-xl shadow-lg flex-1 flex flex-col justify-center">
                    <h3 className="text-xl font-bold border-b border-gray-600 pb-3 mb-4 uppercase tracking-wider shrink-0">
                      Ürün Özellikleri
                    </h3>
                    <div className="space-y-4">
                      {currentCategory.fabricProperties.map(prop => {
                        const val = formState.fabricValues[prop];
                        if (!val) return null; 
                        return (
                          <div key={prop} className="flex flex-col">
                            <span className="text-xs text-gray-400 uppercase tracking-wide">{prop}</span>
                            <span className="font-medium text-lg text-gray-100">{val}</span>
                          </div>
                        );
                      })}
                      {Object.keys(formState.fabricValues).length === 0 && (
                        <p className="text-gray-500 italic text-base">Özellik bilgisi girilmedi.</p>
                      )}
                    </div>
                  </div>

                  {/* Disclaimer / Note */}
                  <div className="bg-gray-100 p-4 rounded-lg border-l-4 border-black shrink-0">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <strong>Not:</strong> Üretim toleransı nedeniyle ölçülerde +/- 1-2 cm farklılık olabilir.
                    </p>
                  </div>
                </div>

                {/* Silhouette Image Container (60%) */}
                {/* Because parent has min-h-0, h-full here means "whatever height is left" */}
                <div className="w-3/5 h-full p-0 border border-dashed border-gray-400 rounded-lg overflow-hidden flex items-center justify-center bg-white">
                   {currentCategory.silhouetteImage ? (
                     <img 
                      src={currentCategory.silhouetteImage} 
                      alt="Model Siluet" 
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain mix-blend-multiply opacity-90 p-1"
                     />
                   ) : (
                     <div className="w-full h-full text-gray-400 flex flex-col items-center justify-center bg-gray-50">
                       <span>Görsel Yok</span>
                     </div>
                   )}
                </div>
              </div>
            </main>
          )}

          {/* Footer */}
          <footer className="bg-black text-white py-4 text-center z-10 shrink-0">
            <p className="text-base font-light tracking-widest opacity-80">
              {formState.websiteUrl}
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CanvasPreview;