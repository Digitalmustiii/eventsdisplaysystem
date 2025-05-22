// components/Header.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Sun, Cloud, CloudRain, CloudLightning, CloudSnow, CloudFog } from 'lucide-react'

type Weather = {
  main: { temp: number },
  weather: Array<{ main: string, id: number }>
}

export default function Header() {
  const [weatherData, setWeatherData] = useState<Weather | null>(null)
  const [now, setNow] = useState<Date>(new Date())
  
  // 1) Fetch weather once on mount and then every hour
  useEffect(() => {
    // Function to fetch weather data
    const fetchWeather = () => {
      fetch(
        `https://api.openweathermap.org/data/2.5/weather` +
        `?q=Chengdu,cn&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API}`
      )
        .then(res => res.json())
        .then((data: Weather) => setWeatherData(data))
        .catch(console.error)
    }
    
    // Initial fetch
    fetchWeather()
    
    // Set up hourly fetching
    const hourInMs = 60 * 60 * 1000
    const intervalId = setInterval(fetchWeather, hourInMs)
    
    // Clean up
    return () => clearInterval(intervalId)
  }, [])
  
  // 2) Update time every minute
  useEffect(() => {
    const tick = () => setNow(new Date())
    // align to top of minute
    const msToNextMinute = (60 - now.getSeconds()) * 1000
    const timeoutId = setTimeout(() => {
      tick()
      const intervalId = setInterval(tick, 60 * 1000)
      // cleanup
      return () => clearInterval(intervalId)
    }, msToNextMinute)
    
    return () => clearTimeout(timeoutId)
  }, [now])
  
  // Formatters
  const dateStr = now.toLocaleDateString('en-US', {
    timeZone: 'Asia/Shanghai',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
  
  const timeStr = now.toLocaleTimeString('en-US', {
    timeZone: 'Asia/Shanghai',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  
  // Enhanced weather icon selection with modern styling
  const getWeatherIcon = () => {
    if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) {
      return (
        <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-900 to-black p-1 rounded-full shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800 to-transparent opacity-30 rounded-full" />
          <Sun className="text-yellow-300 drop-shadow-xl filter sm:w-8 sm:h-8 w-6 h-6" strokeWidth={1.5} />
        </div>
      )
    }
    
    const weatherId = weatherData.weather[0].id;
    const iconSize = "sm:w-8 sm:h-8 w-6 h-6";
    
    // Clear
    if (weatherId >= 800 && weatherId <= 802) {
      return (
        <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-900 to-black p-1 rounded-full shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800 to-transparent opacity-30 rounded-full" />
          <Sun 
            className={`text-yellow-300 drop-shadow-xl ${iconSize}`}
            strokeWidth={1.5}
            style={{ filter: 'drop-shadow(0 0 8px rgba(252, 211, 77, 0.6))' }}
          />
        </div>
      )
    }
    // Clouds
    else if (weatherId >= 803 && weatherId <= 804) {
      return (
        <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-900 to-black p-1 rounded-full shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800 to-transparent opacity-30 rounded-full" />
          <Cloud 
            className={`text-gray-200 drop-shadow-lg ${iconSize}`}
            strokeWidth={1.5} 
            style={{ filter: 'drop-shadow(0 0 4px rgba(229, 231, 235, 0.5))' }}
          />
        </div>
      )
    }
    // Rain, drizzle
    else if ((weatherId >= 300 && weatherId <= 321) || (weatherId >= 500 && weatherId <= 531)) {
      return (
        <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-900 to-black p-1 rounded-full shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800 to-transparent opacity-30 rounded-full" />
          <CloudRain 
            className={`text-blue-300 drop-shadow-lg ${iconSize}`}
            strokeWidth={1.5}
            style={{ filter: 'drop-shadow(0 0 4px rgba(147, 197, 253, 0.5))' }}
          />
        </div>
      )
    }
    // Thunderstorm
    else if (weatherId >= 200 && weatherId <= 232) {
      return (
        <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-900 to-black p-1 rounded-full shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800 to-transparent opacity-30 rounded-full" />
          <CloudLightning 
            className={`text-yellow-400 drop-shadow-lg ${iconSize}`}
            strokeWidth={1.5}
            style={{ filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))' }}
          />
        </div>
      )
    }
    // Snow
    else if (weatherId >= 600 && weatherId <= 622) {
      return (
        <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-900 to-black p-1 rounded-full shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800 to-transparent opacity-30 rounded-full" />
          <CloudSnow 
            className={`text-blue-100 drop-shadow-lg ${iconSize}`}
            strokeWidth={1.5}
            style={{ filter: 'drop-shadow(0 0 4px rgba(219, 234, 254, 0.6))' }}
          />
        </div>
      )
    }
    // Mist, Fog, etc.
    else if (weatherId >= 701 && weatherId <= 781) {
      return (
        <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-900 to-black p-1 rounded-full shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-t from-blue-800 to-transparent opacity-30 rounded-full" />
          <CloudFog 
            className={`text-gray-300 drop-shadow-lg ${iconSize}`}
            strokeWidth={1.5}
            style={{ filter: 'drop-shadow(0 0 4px rgba(209, 213, 219, 0.5))' }}
          />
        </div>
      )
    }
    // Default
    return (
      <div className="relative flex items-center justify-center bg-gradient-to-br from-blue-900 to-black p-1 rounded-full shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-800 to-transparent opacity-30 rounded-full" />
        <Sun 
          className={`text-yellow-300 drop-shadow-xl ${iconSize}`}
          strokeWidth={1.5}
          style={{ filter: 'drop-shadow(0 0 8px rgba(252, 211, 77, 0.6))' }}
        />
      </div>
    )
  }
  
  // Get formatted temperature
  const getTemperature = () => {
    if (!weatherData || weatherData.main?.temp === undefined) {
      return "--"
    }
    return Math.round(weatherData.main.temp)
  }

  return (
    <header className="flex flex-col lg:flex-row w-full lg:h-24 h-auto text-white select-none overflow-hidden font-[Georgia]">
      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden w-full">
        {/* Top row: Logo + School Name */}
        <div className="flex items-center justify-center bg-black px-4 py-3">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"
              alt="UESTC"
              width={40}
              height={40}
              className="object-contain"
            />
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-wide">UESTC</h1>
          </div>
        </div>
        
        {/* Bottom row: Weather + Date/Time + Deadline */}
        <div 
          className="flex items-center justify-between px-4 py-2"
          style={{
            background: 'linear-gradient(to right, #163E8C, #0367A6)'
          }}
        >
          {/* Weather */}
          <div className="flex items-center space-x-2">
            <div className="flex flex-col items-center">
              {getWeatherIcon()}
              <span className="text-xs font-semibold" style={{ 
                textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                fontVariantNumeric: 'tabular-nums' 
              }}>
                {getTemperature()}°
              </span>
            </div>
            <div className="text-xs font-medium hidden sm:block" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
              Chengdu
            </div>
          </div>
          
          {/* Date/Time */}
          <div className="flex flex-col items-end text-right">
            <div className="text-lg sm:text-xl font-bold" style={{ 
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.5px'
            }}>
              {dateStr}
            </div>
            <div className="text-base sm:text-lg font-semibold mt-1" style={{ 
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {timeStr}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex w-full h-24">
        {/* Left: Logo + School Name (Black Background) */}
        <div className="flex items-center bg-black px-8 h-full">
          <div className="flex items-center space-x-4">
            <Image
              src="/logo.png"
              alt="UESTC"
              width={80}
              height={80}
              className="object-contain"
            />
            <h1 className="text-7xl font-bold uppercase tracking-wide">UESTC</h1>
          </div>
        </div>
        
        {/* Center: Weather (Black Background) - Properly aligned with right side */}
        <div className="flex-1 bg-black h-full">
          {/* This div takes all the space and pushes the weather to align with right side */}
          <div className="w-full h-full flex justify-end items-center">
            <div className="flex items-center space-x-5 pr-12">
              <div className="flex flex-col items-center">
                {getWeatherIcon()}
                <span className="mt-1 text-lg font-semibold" style={{ 
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                  fontVariantNumeric: 'tabular-nums' 
                }}>
                  {getTemperature()}°
                </span>
              </div>
              
              <div className="text-base font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
                Chengdu, China
              </div>
            </div>
          </div>
        </div>
        
        {/* Angled divider */}
        <div 
          className="h-full"
          style={{
            width: '30px',
            background: 'linear-gradient(to bottom right, black 49%, #163E8C 51%)'
          }}
        />
        
        {/* Right: Date/Time (Blue Background with Gradient) */}
        <div 
          className="flex flex-col items-center justify-center px-12 h-full min-w-max"
          style={{
            background: 'linear-gradient(to right, #163E8C, #0367A6)'
          }}
        >
          <div className="text-4xl font-bold mb-2" style={{ 
            textShadow: '0 2px 8px rgba(0,0,0,0.4)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '1px'
          }}>
            {dateStr}
          </div>
          <div className="text-3xl font-semibold" style={{ 
            textShadow: '0 2px 6px rgba(0,0,0,0.3)',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.5px'
          }}>
            {timeStr}
          </div>
        </div>
      </div>
    </header>
  )
}