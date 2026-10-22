import { createFileRoute } from '@tanstack/react-router';

import { NotFoundPage } from '@/components/feedback/NotFoundPage';

export const Route = createFileRoute('/$')({ component: NotFoundPage });
