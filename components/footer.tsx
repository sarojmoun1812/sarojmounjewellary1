
import Link from "next/link";
import { Instagram, Youtube, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ivory-200/70 bg-ivory-50 font-body text-charcoal-700 luxury-mesh">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-champagne-400/55 to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-champagne-200/15 to-transparent" />
      <div className="container-luxury relative py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 md:gap-10">
          {/* Brand */}
          <div className="space-y-5 md:pr-4">
            <h3 className="text-2xl font-heading font-light tracking-wide text-charcoal-900">Saroj Moun</h3>
            <p className="max-w-xs text-sm leading-relaxed text-charcoal-600">
              Haathon se bani 925 chaandi ki jewellery — har Indian aurat ke liye khaas. Shaadi, tyohaar ya roz ke liye.
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
          <div className="md:border-l md:border-ivory-200/80 md:pl-8">
            <h4 className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.2em] text-charcoal-500">
              Shop
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop?category=rings" className="link-elegant">Rings</Link></li>
              <li><Link href="/shop?category=necklaces" className="link-elegant">Necklaces</Link></li>
              <li><Link href="/shop?category=kadas" className="link-elegant">Kadas</Link></li>
              <li><Link href="/shop?category=earrings" className="link-elegant">Earrings</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div className="md:border-l md:border-ivory-200/80 md:pl-8">
            <h4 className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.2em] text-charcoal-500">
              Information
            </h4>
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

        <div className="mt-14 border-t border-ivory-200/90 pt-10 text-center text-xs text-charcoal-500">
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
