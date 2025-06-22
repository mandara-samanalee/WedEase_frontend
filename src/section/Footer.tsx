const Footer = () => {
    return (
      <footer className="bg-purple-800 text-white py-10 mt-16">
        <div className="container mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            
            {/* About Section */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">About Us</h3>
              <p className="text-gray-300">
                We make wedding planning seamless and stress-free, bringing your dream celebration to life.
              </p>
            </div>
  
            {/* Quick Links */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-gray-300 transition">Home</a></li>
                <li><a href="#about" className="hover:text-gray-300 transition">About</a></li>
                <li><a href="#services" className="hover:text-gray-300 transition">Services</a></li>
                <li><a href="#contacts" className="hover:text-gray-300 transition">Contact</a></li>
              </ul>
            </div>
  
            {/* Contact Section */}
            <div>
              <h3 className="text-2xl font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-300">Email: support@wedease.com</p>
              <p className="text-gray-300">Phone: +123 456 7890</p>
              <p className="text-gray-300">Location: 123 Wedding St, Bliss City</p>
            </div>
  
          </div>
  
          {/* Bottom Section */}
          <div className="border-t border-gray-500 mt-8 pt-6 text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} WedEase. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };

export default Footer;