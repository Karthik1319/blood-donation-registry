import Card from '@/components/ui/Card';
import { LABELS } from '@/constants/labels';

// Placeholder landing page; donor and donation screens will be added here later.
function HomePage() {
  return (
    <Card title={LABELS.HOME_TITLE}>
      <p>{LABELS.HOME_TEXT}</p>
    </Card>
  );
}

export default HomePage;
