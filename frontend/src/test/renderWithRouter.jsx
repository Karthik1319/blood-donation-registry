import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Components using Link or useNavigate need a router around them, even in tests.
export function renderWithRouter(ui, { route = '/' } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}
