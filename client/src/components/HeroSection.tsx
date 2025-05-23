import React from "react";

export default function HeroSection() {
  return (
    <div 
      className="relative overflow-hidden bg-cover bg-center h-64 md:h-80" 
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1469371670807-013ccf25f16a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&h=1080&q=80')"
      }}
    >
      <div className="absolute inset-0 bg-primary bg-opacity-40"></div>
      <div className="container mx-auto px-4 h-full flex items-center justify-center relative z-10">
        <div className="text-center max-w-2xl">
          <h2 className="font-display text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Create Your Perfect Wedding Ceremony
          </h2>
          <p className="text-white text-lg md:text-xl">
            Select beautiful songs for each moment of your special day
          </p>
        </div>
      </div>
    </div>
  );
}
