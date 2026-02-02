const Footer = () => {
  const quickLinks = [
    { path: "/about", label: "About" },
    { path: "/facilities", label: "Facilities" },
    { path: "/programs", label: "Programs" },
    { path: "/news", label: "News" },
    { path: "/gallery", label: "Gallery" },
  ];
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">
              Centre for Empowerment of Women
            </h3>
            <p className="text-gray-300">
              Empowering women builds stronger communities.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <QuickLinksList links={quickLinks} />
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Email: info@palitch.edu</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Education St, City</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
          <p>&copy; 2008 Anna University. All Right Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

const QuickLinksList = ({ links }) => {
  return (
    <ul className="space-y-2">
      {links.map((link) => (
        <li key={link.path}>
          <a href={link.path} className="text-gray-300 hover:text-white">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
};
