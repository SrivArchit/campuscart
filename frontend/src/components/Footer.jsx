import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

          {/* Brand */}
          <div>
            <Link to="/" className="text-lg font-bold text-blue-600">
              🛒 CampusCart
            </Link>
            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              The trusted marketplace for MUJ students to buy and sell
              second-hand books, notes, electronics and more.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-gray-500 hover:text-blue-600 transition">
                  Browse Listings
                </Link>
              </li>
              <li>
                <Link to="/add-listing" className="text-sm text-gray-500 hover:text-blue-600 transition">
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link to="/my-listings" className="text-sm text-gray-500 hover:text-blue-600 transition">
                  My Listings
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">About</h4>
            <ul className="space-y-2">
              <li className="text-sm text-gray-500">📍 Manipal University Jaipur</li>
              <li className="text-sm text-gray-500">📧 Only @muj.manipal.edu emails</li>
              <li className="text-sm text-gray-500">🔒 Verified students only</li>
            </ul>
          </div>

        </div>

        {/* Divider + Copyright */}
        <div className="border-t border-gray-100 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} CampusCart. Built for MUJ students.
          </p>
          <p className="text-xs text-gray-400">
            Made with ❤️ for the campus community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
