import { APP_CONFIG } from '@/constants/config';
import { LABELS } from '@/constants/labels';

// Bottom bar shown on every page.
function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer__tagline">{LABELS.FOOTER_TAGLINE}</p>
      <p>
        © {currentYear} {APP_CONFIG.APP_NAME}. {LABELS.FOOTER_RIGHTS}
      </p>
    </footer>
  );
}

export default Footer;
