import React from 'react';
import vendor from '@/assets/images/vendor.png';
import budget from '@/assets/images/budget.png';
import rsvp from '@/assets/images/RSVP.png';
import timeline from '@/assets/images/timeline.png';
import event from '@/assets/images/event.png';
import service from '@/assets/images/service.png';

const serviceCardsData = [
  {
    image: event,
    title: "Wedding Planing & Event Design",
    description: "Plan your dream wedding with ease  stress-free.",
  },
  {
    image: vendor,
    title: "Vendor Selection",
    description: "Find trusted vendors for your big day.",
  },
  {
    image: service,
    title: 'Service Booking',
    description: "Secure top-notch catering, decorators, photographers, and more all in one place.",
  },
  {
    image: rsvp,
    title: "Guest & RSVP Management",
    description: "Seamlessly manage guest lists and RSVPs.",
  },
  {
    image: budget,
    title: "Budget Coordination",
    description: "Stay on budget with our easy-to-use budgeting tools.",
  },
  {
    image: timeline,
    title: "Seamless Task & Timeline Management",
    description: "Stay organized with personalized checklists & timelines to keep everything on schedule.",
  },
];

const ServiceCards: React.FC = () => {
  return (
    <div className="container mx-auto px-32 py-16">
      <h2 className="text-4xl font-bold text-center text-purple-700 mb-10">
        Our Services
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {serviceCardsData.map((service, index) => (
          <div key={index} className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-purple-100" >
            <div className='w-[120px] h-[120px] flex justify-center items-center'>
            <img className="w-[70px] h-[70px]" src={service.image.src} alt={service.title} />
            </div>
            <div className="px-6 py-4">
              <h3 className="font-bold text-xl text-purple-700 mb-2">{service.title}</h3>
              <p className="text-gray-700 text-base">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCards;
