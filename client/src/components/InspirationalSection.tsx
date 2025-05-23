import React from "react";

export default function InspirationalSection() {
  return (
    <section className="bg-secondary bg-opacity-30 py-12 my-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h3 className="font-display text-2xl md:text-3xl font-semibold text-primary mb-4">
            Create a Memorable Ceremony
          </h3>
          <p className="text-neutral-800">
            Music has the power to transform your wedding ceremony into an unforgettable experience. 
            Select songs that resonate with your journey as a couple.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-lg overflow-hidden shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1504714146340-959ca07e1f38?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Church choir performing" 
              className="w-full h-48 object-cover"
            />
            <div className="p-4 bg-white">
              <h4 className="font-display font-medium text-lg text-primary mb-2">
                Professional Performance
              </h4>
              <p className="text-neutral-600 text-sm">
                Our choir will bring your selected songs to life with beautiful harmonies and reverent performance.
              </p>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Couple during wedding ceremony" 
              className="w-full h-48 object-cover"
            />
            <div className="p-4 bg-white">
              <h4 className="font-display font-medium text-lg text-primary mb-2">
                Meaningful Moments
              </h4>
              <p className="text-neutral-600 text-sm">
                Each song marks a special moment in your ceremony, creating a beautiful soundtrack for your sacred union.
              </p>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden shadow-md">
            <img 
              src="https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=400&q=80" 
              alt="Sheet music for wedding" 
              className="w-full h-48 object-cover"
            />
            <div className="p-4 bg-white">
              <h4 className="font-display font-medium text-lg text-primary mb-2">
                Carefully Curated
              </h4>
              <p className="text-neutral-600 text-sm">
                Our selection of hymns and songs has been carefully chosen to suit each part of the Catholic wedding ceremony.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
