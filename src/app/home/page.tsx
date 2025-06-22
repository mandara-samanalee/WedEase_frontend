import home from "@/assets/images/home.png";
import about from "@/assets/images/about.png";
import about2 from "@/assets/images/about-2.png";
import about3 from "@/assets/images/about-3.png";
import ServiceCards from "@/components/ServiceCards";
import Footer from "@/section/Footer";

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-x-hidden">

    {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full bg-purple-200 py-4 px-8 z-10">

        <div className="flex justify-between items-center">
          <h2 className="text-white text-2xl font-semibold">Your Logo</h2>
          <div className="flex space-x-10 text-purple-600">
            <a href="#home" className="hover:text-purple-350">Home</a>
            <a href="#about" className="hover:text-purple-350">About</a>
            <a href="#services" className="hover:text-purple-350">Services</a>
            <a href="#contact" className="hover:text-purple-350">Contacts</a>
          </div>

          <div className="flex space-x-4">
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
      
      {/* Contact Section */}
      <div id="contact">
      <Footer/>
      </div>

    </div>
  )
}