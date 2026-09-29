import PromptLink from '@/components/ui/PromptLink';
import Card from '@/components/ui/Card';
import { LABELS } from '@/constants/labels';
import { ROUTES } from '@/constants/routes';

function NotFoundPage() {
  return (
    <Card title={LABELS.NOT_FOUND_TITLE}>
      <PromptLink
        prompt={LABELS.NOT_FOUND_TEXT}
        to={ROUTES.LOGIN}
        linkText={LABELS.NOT_FOUND_LINK}
      />
    </Card>
  );
}

export default NotFoundPage;
