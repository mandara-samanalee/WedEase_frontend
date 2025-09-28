import home from "@/assets/images/home.png";
import about from "@/assets/images/about.png";
import about2 from "@/assets/images/about-2.png";
import about3 from "@/assets/images/about-3.png";
import vendorSection from "@/assets/images/vendor-section.jpg";
import ServiceCards from "@/section/ServiceCards";
import Footer from "@/section/Footer";
import { GiDiamondRing } from "react-icons/gi";

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-x-hidden">

    {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full bg-purple-100 py-4 px-8 z-10">
        <div className="flex justify-between items-center relative">

          {/* Logo */}
          <div className="flex items-center gap-1">
            <GiDiamondRing className="text-4xl text-purple-700" />
            <div className="text-3xl font-bold bg-gradient-to-t from-purple-700 to-purple-300 bg-clip-text text-transparent tracking-wide">
              WedEase
            </div>
          </div>

          {/* Navigation Links */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-12">
            <a href="#home" 
            className="font-medium transition text-purple-400 hover:text-purple-700">Home</a>
            <a href="#about"  
            className="font-medium transition text-purple-400 hover:text-purple-700">About</a>
            <a href="#services"  
            className="font-medium transition text-purple-400 hover:text-purple-700">Services</a>
            <a href="#vendors"  
            className="font-medium transition text-purple-400 hover:text-purple-700">Vendors</a>
            <a href="#contact"  
            className="font-medium transition text-purple-400 hover:text-purple-700">Contacts</a>
          </div>

          <div className="flex space-x-4 z-10">
            <a href="/register">
              <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition">
                Sign up
              </button>
            </a>
            <a href="/login">
              <button className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition">
                Login
              </button>
            </a>
          </div>
        </div>
      </nav>

      {/* Home Section */}
      <div id="home">
      <img src={home.src} alt="Wedding image" className="h-[800px] w-full object-cover" />

      <div className="absolute bottom-[200px] w-full flex flex-col items-center text-center">
        <h1 className="text-white text-6xl font-bold">Experience the Magic
          of Seamless Planning</h1>
        <a href="/register">
          <button className="mt-10 bg-purple-700 text-white text-[20px] py-3 px-10 rounded-3xl shadow-lg active:scale-105 active:shadow-xl">Start Planning
          </button>
        </a>
      </div>
      </div>

      {/* About Section */}
      <div id="about" className="container mx-auto max-w-[1200px] mt-[100px] p-10 bg-purple-100 rounded-3xl flex flex-col items-center">

        <div className="grid grid-cols-3 gap-16">
          <img src={about.src} alt="About image 1" className="w-[250px] h-auto object-cover rounded-xl" />
          <img src={about2.src} alt="About image 2" className="w-[250px] h-auto object-cover rounded-xl" />
          <img src={about3.src} alt="About image 3" className="w-[250px] h-auto object-cover rounded-xl" />
        </div>


        <div className="mt-6 text-purple-600 text-center max-w-[888px]">
          <p className="text-lg">
            We believe every great journey begins with a plan. Your wedding day is one of the most important moments of your life, and we’re here to make sure it’s as magical as you’ve always dreamed. Our intuitive platform takes the stress out of wedding planning and puts the joy back in, helping you stay organized, focused, and inspired every step of the way. WedEase is your all-in-one companion to create a seamless and unforgettable experience. Let’s turn your vision into reality—together.
          </p>
        </div>
      </div>
      
      {/* Services Section */}
      <div id="services">
        <ServiceCards/>
      </div>

      {/* Vendor Section */}
      <div id="vendors" className="container mx-auto max-w-[1200px] mt-[60px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <div className="flex justify-center">
            <img 
              src={vendorSection.src} 
              alt="Wedding vendor services" 
              className="w-full max-w-[900px] h-[500px] object-cover rounded-xl shadow-lg"
            />
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-4xl font-bold text-purple-700 mb-6">
              Are You a Wedding Vendor?
            </h2>
            <p className="text-lg text-purple-600 mb-8 leading-relaxed">
              Join our network of trusted wedding professionals! Whether you&apos;re a photographer, 
              caterer, florist, DJ, or any other wedding service provider, WedEase connects you 
              with couples planning their perfect day. Grow your business and be part of creating 
              magical moments.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-purple-600">✓ Reach more couples planning their weddings</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-purple-600">✓ Showcase your services and portfolio</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-purple-600">✓ Manage bookings and client communications</span>
              </div>
              <div className="flex items-center justify-center md:justify-start">
                <span className="text-purple-600">✓ Build your reputation with reviews</span>
              </div>
            </div>

            <a href="/vendor/register">
              <button className="bg-purple-700 text-white text-lg py-3 px-8 rounded-3xl shadow-lg active:scale-105 active:shadow-xl transition duration-300">
                Join as a Vendor
              </button>
            </a>
          </div>
        </div>
      </div>
      
      {/* Contact Section */}
      <div id="contact">
      <Footer/>
      </div>

    </div>
  )
}