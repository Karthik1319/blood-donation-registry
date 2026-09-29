import PropTypes from 'prop-types';

/**
 * A native button with visual variants and a loading state.
 * @param {object} props
 * @param {React.ReactNode} props.children - Button label.
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Native button type.
 * @param {'primary'|'secondary'} [props.variant='primary'] - Visual style.
 * @param {boolean} [props.isLoading=false] - Disables the button and shows loadingText.
 * @param {string} [props.loadingText=''] - Label shown while loading; falls back to children.
 * @param {boolean} [props.isFullWidth=false] - Stretches the button to its container width.
 * @param {boolean} [props.isDisabled=false] - Disables the button.
 * @param {Function} [props.onClick] - Click handler.
 */
function Button({
  children,
  type = 'button',
  variant = 'primary',
  isLoading = false,
  loadingText = '',
  isFullWidth = false,
  isDisabled = false,
  onClick,
}) {
  const classNames = ['button', `button--${variant}`, isFullWidth && 'button--full'];

  return (
    <button
      type={type}
      className={classNames.filter(Boolean).join(' ')}
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
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary']),
  isLoading: PropTypes.bool,
  loadingText: PropTypes.string,
  isFullWidth: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;
