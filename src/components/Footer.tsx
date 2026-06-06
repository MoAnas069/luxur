import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-lux-bg-alt border-t border-lux-border py-20">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="text-3xl font-serif tracking-widest uppercase mb-6 block">
            Luxura
          </Link>
          <p className="text-lux-text-muted max-w-sm font-sans leading-relaxed mb-6">
            Luxury, composed with intention. Global sourcing and bespoke interiors curated for refined living.
          </p>
          <div className="flex gap-6 mt-2">
            <a
              href="https://www.instagram.com/luxurafurniture?igsh=b2g2ODZwbGI2Ymtj&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lux-text-muted hover:text-lux-gold transition-colors inline-flex items-center gap-2 text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.008 3.752.052 2.714.124 4.091 1.528 4.215 4.214.044.968.052 1.322.052 3.752c0 2.43-.008 2.784-.052 3.752-.124 2.714-1.528 4.09-4.215 4.214-.968.044-1.322.052-3.752.052-2.43 0-2.784-.008-3.752-.052-2.715-.124-4.091-1.528-4.215-4.214-.044-.968-.052-1.322-.052-3.752 0-2.43.008-2.784.052-3.752.124-2.714 1.528-4.09 4.215-4.214.968-.044 1.322-.052 3.752-.052zm0 1.997c-2.393 0-2.678.01-3.621.054-.233.011-.476.033-.708.079-.49.095-.91.304-1.254.648-.344.344-.553.764-.648 1.254-.046.232-.068.475-.079.708-.044.943-.054 1.228-.054 3.621s.01 2.678.054 3.621c.011.233.033.476.079.708.095.49.304.91.648 1.254.344.344.764.553 1.254.648.232.046.475.068.708.079.943.044 1.228.054 3.621.054s2.678-.01 3.621-.054c.233-.011.476-.033.708-.079.49-.095.91-.304 1.254-.648.344-.344.553-.764.648-1.254.046-.232.068-.475.079-.708.044-.943.054-1.228.054-3.621s-.01-2.678-.054-3.621c-.011-.233-.033-.476-.079-.708-.095-.49-.304-.91-.648-1.254-.344-.344-.764-.553-1.254-.648-.232-.046-.475-.068-.708-.079-.943-.044-1.228-.054-3.621-.054zm0 2.842a3.846 3.846 0 110 7.693 3.846 3.846 0 010-7.693zm0 5.696a1.85 1.85 0 100-3.7 1.85 1.85 0 000 3.7zm4.845-6.223a.96.96 0 11-1.92 0 .96.96 0 011.92 0z" clipRule="evenodd" />
              </svg>
              <span>Instagram</span>
            </a>
            <a
              href="https://www.facebook.com/share/1BpDjfBXTs/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lux-text-muted hover:text-lux-gold transition-colors inline-flex items-center gap-2 text-sm"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
              <span>Facebook</span>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6 uppercase tracking-widest">Explore</h4>
          <ul className="flex flex-col gap-4">
            {["Collections", "Sourcing", "Services", "About", "Contact"].map((item) => (
              <li key={item}>
                <Link
                  href={`/${item.toLowerCase()}`}
                  className="text-lux-text-muted hover:text-lux-gold transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6 uppercase tracking-widest">Inquiries</h4>
          <ul className="flex flex-col gap-4">
            <li className="text-lux-text-muted">
              <a href="mailto:support@luxurafurnitures.com" className="hover:text-lux-gold transition-colors">
                support@luxurafurnitures.com
              </a>
            </li>
            <li className="text-lux-text-muted">
              <a href="https://wa.me/14039717695" target="_blank" rel="noopener noreferrer" className="hover:text-lux-gold transition-colors">
                +1 (403) 971-7695
              </a>
            </li>
            <li className="text-lux-text-muted mt-4">Canada • USA • UK • India • Australia & UAE</li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-20 pt-8 border-t border-lux-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-lux-text-muted">
        <p>&copy; 2018 Luxura. All rights reserved.</p>

        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-lux-gold transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-lux-gold transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
