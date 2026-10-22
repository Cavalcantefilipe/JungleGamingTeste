import { createFileRoute } from '@tanstack/react-router';

import { NotFoundPage } from '@/features/layout/NotFoundPage';

export const Route = createFileRoute('/$')({ component: NotFoundPage });
