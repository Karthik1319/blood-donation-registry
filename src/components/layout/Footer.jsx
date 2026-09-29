import { LABELS } from '@/constants/labels';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        &copy; {currentYear} {LABELS.FOOTER_TEXT}
      </p>
    </footer>
  );
}

export default Footer;
