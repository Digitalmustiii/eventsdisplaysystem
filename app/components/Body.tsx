//body.tsx
'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import UpcomingEvents from './UpcomingEvents'

export default function Body() {
  // Images for the slideshow
  const images = [
    "/main-building.jpg",
    "/campus-view.jpg",  
    "/basketball.jpg",
    "/dorm.jpg",
    "/hall.jpg",
    "/hall2.jpg",
    "/library-westlake.jpg",
    "/library2.jpg",
    "/aerial-view2.jpg",
    "/stadium.jpg",
    "/main-buildingnight.jpg",
    "/Gingko.jpg",
    "/garden.jpg",
    "/scientific-research.jpg",
    "/aerial-view.jpg",
  ];
  
  // State for tracking current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Effect for image rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 7000); // 7 seconds interval
    
    return () => clearInterval(interval);
  }, [images.length]);
  
  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-96px)] lg:h-[calc(100vh-96px)] bg-black">
      {/* Mobile/Tablet Layout - Stack vertically */}
      <div className="lg:hidden w-full h-full flex flex-col">
        {/* Slideshow - Taking most of the height on mobile */}
        <div className="flex-1 relative overflow-hidden min-h-64">
          {/* Image slideshow */}
          {images.map((image, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={image}
                alt={`Campus Scene ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          
          {/* Modern gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60"></div>
          
          {/* Image indicator dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
              <div 
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Apply Now Section - Compact for mobile */}
        <div 
          className="h-20 sm:h-24 flex items-center justify-center px-4"
          style={{
            background: 'linear-gradient(90deg, #0F2C59, #164B87)',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div className="flex items-center justify-between w-full">
            {/* Left side: Shape Your Future text */}
            <div className="flex flex-col">
              <h1 className="font-bold text-lg sm:text-xl text-white"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                  letterSpacing: "0.5px",
                  textShadow: "0px 1px 3px rgba(0,0,0,0.3)"
                }}
              >
                Shape Your Future
              </h1>
            </div>
            
            {/* Right side: Apply Now button and URL */}
            <div className="flex flex-col items-end">
              <div className="text-sm sm:text-base font-bold tracking-wider text-white mb-1 text-right"
                style={{
                  fontFamily: "'Montserrat', sans-serif"
                }}
              >
                APPLY NOW
              </div>
              
              <div 
                className="bg-white text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 rounded font-medium flex items-center justify-center"
                style={{ 
                  color: '#0F2C59', 
                  fontFamily: "'Poppins', sans-serif", 
                  borderLeft: "2px solid #3B82F6",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                }}
              >
                admission.uestc.edu.cn
              </div>
            </div>
          </div>
        </div>
        
        {/* Events Section - Compact for mobile */}
        <div className="h-40 sm:h-48">
          <UpcomingEvents />
        </div>
      </div>

      {/* Desktop Layout - Side by side */}
      <div className="hidden lg:flex w-full h-full">
        {/* Left column: Events - exactly 50% width */}
        <div className="w-1/2 h-full" style={{ width: '50%', flex: '0 0 50%' }}>
          <UpcomingEvents />
        </div>
        
        {/* Right column: Slideshow + Apply Now - exactly 50% width */}
        <div className="w-1/2 h-full flex flex-col" style={{ width: '50%', flex: '0 0 50%' }}>
          {/* Slideshow - Taking 80% of the height */}
          <div className="h-4/5 relative overflow-hidden">
            {/* Image slideshow */}
            {images.map((image, index) => (
              <div 
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Image
                  src={image}
                  alt={`Campus Scene ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}
            
            {/* Modern gradient overlay similar to airport/hospital displays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60"></div>
            
            {/* Image indicator dots - modern touch */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                  }`}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Apply Now Section - Taking 20% of the space with improved layout */}
          <div 
            className="h-1/5 flex items-center justify-center"
            style={{
              background: 'linear-gradient(90deg, #0F2C59, #164B87)',
              borderTop: '1px solid rgba(255,255,255,0.1)'
            }}
          >
            {/* Center aligned content with cohesive design */}
            <div className="flex items-center justify-between w-10/12">
              {/* Left side: Shape Your Future text */}
              <div className="flex flex-col">
                <h1 className="font-bold text-4xl text-white"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: "0.5px",
                    textShadow: "0px 1px 3px rgba(0,0,0,0.3)"
                  }}
                >
                  Shape Your Future
                </h1>
              </div>
              
              {/* Right side: Apply Now button and URL */}
              <div className="flex flex-col">
                <div className="text-2xl font-bold tracking-wider text-white mb-2 text-right"
                  style={{
                    fontFamily: "'Montserrat', sans-serif"
                  }}
                >
                  APPLY NOW
                </div>
                
                <div 
                  className="bg-white text-base px-5 py-2 rounded-md font-medium flex items-center justify-center"
                  style={{ 
                    color: '#0F2C59', 
                    fontFamily: "'Poppins', sans-serif", 
                    width: '280px',
                    borderLeft: "3px solid #3B82F6",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                  }}
                >
                  http://admission.uestc.edu.cn/
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}