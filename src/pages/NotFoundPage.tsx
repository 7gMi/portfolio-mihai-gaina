import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold text-text-primary">
          {t('notFound.title')}
        </h1>
        <p className="mt-2 text-text-secondary">
          {t('notFound.message')}
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-sm text-text-inverted transition-all duration-150 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        >
          <Home size={16} />
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
}
