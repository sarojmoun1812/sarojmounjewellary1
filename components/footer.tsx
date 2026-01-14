
import Link from "next/link";
import { Instagram, Youtube, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ivory-50 border-t border-ivory-200 text-charcoal-700 font-body">
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-light tracking-wide text-charcoal-900">Saroj Moun</h3>
            <p className="text-sm text-charcoal-500 max-w-xs">
              Premium handcrafted silver jewellery for the modern woman. Timeless, minimal, and elegant.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="https://instagram.com/sarojmounfashion" target="_blank" rel="noopener noreferrer" className="text-champagne-600 hover:text-charcoal-900 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@sarojmoun1207" target="_blank" rel="noopener noreferrer" className="text-champagne-600 hover:text-charcoal-900 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-heading font-light text-charcoal-900 mb-4 tracking-wide">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop?category=rings" className="link-elegant">Rings</Link></li>
              <li><Link href="/shop?category=necklaces" className="link-elegant">Necklaces</Link></li>
              <li><Link href="/shop?category=kadas" className="link-elegant">Kadas</Link></li>
              <li><Link href="/shop?category=earrings" className="link-elegant">Earrings</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-heading font-light text-charcoal-900 mb-4 tracking-wide">Information</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="link-elegant">About Us</Link></li>
              <li><Link href="/contact" className="link-elegant">Contact Us</Link></li>
              <li><Link href="/shipping" className="link-elegant">Shipping Policy</Link></li>
              <li><Link href="/return-policy" className="link-elegant">Returns & Refunds</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-light text-charcoal-900 mb-4 tracking-wide">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-champagne-600" />
                <span>+91 81687 90171</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-champagne-600" />
                <span>sarojmounjewellary@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-ivory-200 text-center text-xs text-charcoal-400">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <Link href="/privacy" className="link-elegant">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="link-elegant">Terms & Conditions</Link>
            <span>•</span>
            <Link href="/return-policy" className="link-elegant">Return Policy</Link>
            <span>•</span>
            <Link href="/shipping" className="link-elegant">Shipping Policy</Link>
          </div>
          <p className="tracking-wide">&copy; {new Date().getFullYear()} Saroj Moun Jewellery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
