import PropTypes from 'prop-types';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { BLOOD_GROUPS } from '@/constants/config';
import { LABELS } from '@/constants/labels';

/**
 * Search box and blood-group filter above the donor table.
 * @param {object} props
 * @param {{search: string, bloodGroup: string}} props.filters - current filter values.
 * @param {Function} props.onChange - called with (filterName, newValue).
 */
function DonorFilters({ filters, onChange }) {
  return (
    <div className="filters" role="search">
      <Input
        id="donorSearch"
        label={LABELS.SEARCH_DONORS}
        type="search"
        value={filters.search}
        placeholder={LABELS.SEARCH_PLACEHOLDER}
        onChange={(event) => onChange('search', event.target.value)}
      />
      <Select
        id="bloodGroupFilter"
        label={LABELS.BLOOD_GROUP}
        options={BLOOD_GROUPS}
        placeholder={LABELS.ALL_BLOOD_GROUPS}
        value={filters.bloodGroup}
        onChange={(event) => onChange('bloodGroup', event.target.value)}
      />
    </div>
  );
}

DonorFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string.isRequired,
    bloodGroup: PropTypes.string.isRequired,
  }).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DonorFilters;
