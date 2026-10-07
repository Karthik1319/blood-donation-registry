import PropTypes from 'prop-types';

/**
 * White box with a title, used to frame forms and page content.
 * @param {object} props
 * @param {string} [props.title] - heading shown at the top; leave out when the page heading is enough.
 * @param {'h1'|'h2'} [props.titleAs] - heading level; use h2 when the page already has an h1.
 * @param {string} [props.subtitle] - short description under the title.
 * @param {boolean} [props.isWide] - uses the full content width instead of the narrow form width.
 * @param {React.ReactNode} props.children - card content.
 */
function Card({ title = '', titleAs: Heading = 'h1', subtitle = '', isWide = false, children }) {
  return (
    <section className={isWide ? 'card card--wide' : 'card'}>
      {title && <Heading className="card__title">{title}</Heading>}
      {subtitle && <p className="card__subtitle">{subtitle}</p>}
      {children}
    </section>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  titleAs: PropTypes.oneOf(['h1', 'h2']),
  subtitle: PropTypes.string,
  isWide: PropTypes.bool,
  children: PropTypes.node.isRequired,
};

export default Card;
