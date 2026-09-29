import PropTypes from 'prop-types';

/**
 * White box with a title, used to frame forms and page content.
 * @param {object} props
 * @param {string} props.title - heading shown at the top.
 * @param {string} [props.subtitle] - short description under the title.
 * @param {React.ReactNode} props.children - card content.
 */
function Card({ title, subtitle = '', children }) {
  return (
    <section className="card">
      <h1 className="card__title">{title}</h1>
      {subtitle && <p className="card__subtitle">{subtitle}</p>}
      {children}
    </section>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Card;
