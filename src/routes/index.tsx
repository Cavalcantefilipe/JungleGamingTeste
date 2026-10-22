import { createFileRoute } from '@tanstack/react-router';

import { HomePage } from '@/features/catalog/components/HomePage';

export const Route = createFileRoute('/')({ component: HomePage });
