import { useId } from 'react';
import PropTypes from 'prop-types';

/**
 * A titled content panel, exposed to assistive tech as a labelled section.
 * @param {object} props
 * @param {string} props.title - Heading text (rendered as the page's h1).
 * @param {string} [props.subtitle=''] - Short description under the title.
 * @param {React.ReactNode} props.children - Card body.
 * @param {React.ReactNode} [props.footer=null] - Optional content below the body.
 */
function Card({ title, subtitle = '', children, footer = null }) {
  // useId gives a unique id even if several cards are on the same page.
  const titleId = useId();

  return (
    <section className="card" aria-labelledby={titleId}>
      <header className="card__header">
        <h1 id={titleId} className="card__title">
          {title}
        </h1>
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
      </header>
      <div className="card__body">{children}</div>
      {footer && <footer className="card__footer">{footer}</footer>}
    </section>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

export default Card;
