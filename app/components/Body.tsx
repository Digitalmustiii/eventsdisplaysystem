'use client'

import Image from 'next/image'
import UpcomingEvents from './UpcomingEvents'

export default function Body() {
  return (
    <div className="flex w-full h-[calc(100vh-96px)] bg-black">
      {/* Left column: Events - 60% width */}
      <div className="w-3/5 h-full">
        <UpcomingEvents />
      </div>
      
      {/* Right column: Graduation Image + Apply Now - 40% width */}
      <div className="w-2/5 flex flex-col h-full">
        {/* Main Image - Taking 60% of the height */}
        <div className="h-3/5 relative overflow-hidden">
          <Image
            src="/graduation-hat.jpg"
            alt="Graduation Hats"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay text on the image */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
            <h1
              className="text-7xl font-bold italic mb-4 text-white"
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                textShadow:
                  "3px 3px 4px #111826, -3px -3px 4px #111826, 3px -3px 4px #111826, -3px 3px 4px #111826",
                WebkitTextStroke: "1px #111826"
              }}
            >
              Shape Your<br />Future
            </h1>
            <p
              className="bg-white text-3xl px-6 py-2 rounded-md font-bold"
              style={{ color: '#163E8C', fontFamily: "'Poppins', sans-serif" }}
            >
              Join our prestigious MBA<br />program
            </p>
          </div>
        </div>
        
        {/* Apply Now Section - Taking 40% of the space */}
        <div 
          className="h-2/5 flex flex-col justify-center pl-12 text-white rounded-xl"
          style={{
            background: 'linear-gradient(to right, #163E8C, #0367A6)'
          }}
        >
          <div className="font-bold text-5xl tracking-wide mb-6" style={{ fontFamily: "'Montserrat', sans-serif" }}>
            APPLY<br />NOW
          </div>
          <div 
            className="bg-white text-2xl px-8 py-3 rounded-lg font-bold shadow-lg"
            style={{ color: '#163E8C', fontFamily: "'Poppins', sans-serif", letterSpacing: '0.5px', width: '400px' }}
          >
            http://admission.uestc.edu.cn/
          </div>
        </div>
      </div>
    </div>
  )
}