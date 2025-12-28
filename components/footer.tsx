import Link from "next/link";
import { Instagram, Youtube, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold">Saroj Moun</h3>
            <p className="text-sm text-gray-300">
              Premium handcrafted silver jewellery for the modern Indian woman.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com/sarojmounfashion" target="_blank" rel="noopener noreferrer" 
                 className="hover:text-accent transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@sarojmoun1207" target="_blank" rel="noopener noreferrer"
                 className="hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/shop?category=rings" className="hover:text-accent transition-colors">Rings</Link></li>
              <li><Link href="/shop?category=necklaces" className="hover:text-accent transition-colors">Necklaces</Link></li>
              <li><Link href="/shop?category=kadas" className="hover:text-accent transition-colors">Kadas</Link></li>
              <li><Link href="/shop?category=earrings" className="hover:text-accent transition-colors">Earrings</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4">Information</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
              <li><Link href="/shipping" className="hover:text-accent transition-colors">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="hover:text-accent transition-colors">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+91 81687 90171</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>sarojmounjewellary@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link href="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-accent transition-colors">Terms & Conditions</Link>
            <span>•</span>
            <Link href="/return-policy" className="hover:text-accent transition-colors">Return Policy</Link>
            <span>•</span>
            <Link href="/shipping" className="hover:text-accent transition-colors">Shipping Policy</Link>
          </div>
          <p>&copy; {new Date().getFullYear()} Saroj Moun Jewellery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
