import PropTypes from 'prop-types';

/**
 * Standard button. While loading it is disabled to prevent double submits.
 * @param {object} props
 * @param {React.ReactNode} props.children - button text.
 * @param {'button'|'submit'} [props.type] - HTML button type.
 * @param {'primary'|'secondary'} [props.variant] - visual style.
 * @param {boolean} [props.isLoading] - disables the button and shows loadingText.
 * @param {string} [props.loadingText] - text shown while loading.
 * @param {boolean} [props.isDisabled] - disables the button.
 * @param {boolean} [props.isFullWidth] - stretches to the container width.
 * @param {Function} [props.onClick] - click handler.
 */
function Button({
  children,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  loadingText = '',
  isDisabled = false,
  isFullWidth = false,
  onClick,
}) {
  const classes = ['button', `button--${variant}`, isFullWidth ? 'button--full' : ''].join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={isDisabled || isLoading}
      aria-busy={isLoading}
      onClick={onClick}
    >
      {isLoading && loadingText ? loadingText : children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.oneOf(['button', 'submit']),
  variant: PropTypes.oneOf(['primary', 'secondary']),
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  isDisabled: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
