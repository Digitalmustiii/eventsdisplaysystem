// components/Header.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Sun, Cloud, CloudRain } from 'lucide-react'

type Weather = {
  main: { temp: number },
  weather: Array<{ main: string, id: number }>
}

export default function Header() {
  const [weatherData, setWeatherData] = useState<Weather | null>(null)
  const [now, setNow] = useState<Date>(new Date())
  
  // 1) Fetch weather once on mount
  useEffect(() => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather` +
      `?q=Chengdu,cn&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API}`
    )
      .then(res => res.json())
      .then((data: Weather) => setWeatherData(data))
      .catch(console.error)
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
  
  // Weather icon selection based on weather code
  const getWeatherIcon = () => {
    if (!weatherData || !weatherData.weather || weatherData.weather.length === 0) {
      return <Sun className="text-yellow-300" size={56} />
    }
    
    const weatherId = weatherData.weather[0].id;
    
    // Clear
    if (weatherId >= 800 && weatherId <= 802) {
      return <Sun className="text-yellow-300" size={56} />
    }
    // Clouds
    else if (weatherId >= 803 && weatherId <= 804) {
      return <Cloud className="text-gray-200" size={56} />
    }
    // Rain, drizzle, thunderstorm
    else if (weatherId >= 200 && weatherId <= 531) {
      return <CloudRain className="text-blue-200" size={56} />
    }
    // Default
    return <Sun className="text-yellow-300" size={56} />
  }
  
  // Get formatted temperature
  const getTemperature = () => {
    if (!weatherData || weatherData.main?.temp === undefined) {
      return "--"
    }
    return Math.round(weatherData.main.temp)
  }

  return (
    <header className="flex w-full h-24 text-white select-none overflow-hidden font-[Georgia]">
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
          <h1 className="text-3xl font-bold uppercase tracking-wide">UESTC</h1>
        </div>
      </div>
      
      {/* Center: Weather (Black Background) - Modified to position weather towards the right */}
      <div className="flex-1 bg-black h-full flex items-center justify-end pr-16">
        {/* Weather content */}
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center space-x-3">
            {getWeatherIcon()}
            <div className="text-3xl font-bold">{getTemperature()}°C</div>
          </div>
          <div className="text-lg mt-1">Chengdu, China</div>
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
      
      {/* Right: Date/Time + Deadline (Blue Background with Gradient) */}
      <div 
        className="flex flex-col items-end justify-center px-10 h-full"
        style={{
          background: 'linear-gradient(to right, #163E8C, #0367A6)'
        }}
      >
        <div className="text-2xl font-medium">{dateStr} &nbsp;&nbsp;{timeStr}</div>
        <div className="text-md uppercase tracking-wide font-medium mt-2">
          CSC APPLICATION DEADLINE: JULY 31
        </div>
      </div>
    </header>
  )
}