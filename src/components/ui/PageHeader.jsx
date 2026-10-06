import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

/**
 * Page heading with an optional breadcrumb trail; also sets the browser tab title.
 * The current page is always the last breadcrumb, so `breadcrumbs` lists only the steps before it.
 * @param {object} props
 * @param {string} props.title - page heading (h1) and last breadcrumb.
 * @param {{to: string, label: string}[]} [props.breadcrumbs] - earlier steps, from BREADCRUMBS.
 * @param {string} [props.breadcrumbLabel] - name of the breadcrumb landmark for screen readers.
 * @param {string} [props.subtitle] - short description under the heading.
 */
function PageHeader({ title, breadcrumbs = [], breadcrumbLabel = '', subtitle = '' }) {
  useDocumentTitle(title);

  return (
    <div className="page-header">
      {breadcrumbs.length > 0 && (
        <nav aria-label={breadcrumbLabel}>
          <ol className="breadcrumbs">
            {breadcrumbs.map((crumb) => (
              <li key={crumb.to}>
                <Link to={crumb.to}>{crumb.label}</Link>
              </li>
            ))}
            <li aria-current="page">{title}</li>
          </ol>
        </nav>
      )}
      <h1 className="page-header__title">{title}</h1>
      {subtitle && <p className="page-header__subtitle">{subtitle}</p>}
    </div>
  );
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({ to: PropTypes.string.isRequired, label: PropTypes.string.isRequired }),
  ),
  breadcrumbLabel: PropTypes.string,
  subtitle: PropTypes.string,
};

export default PageHeader;
