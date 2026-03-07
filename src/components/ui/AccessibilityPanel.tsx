import { useTranslation } from 'react-i18next';
import { Eye, Type, Contrast, Droplets } from 'lucide-react';
import { useAccessibility } from '../../hooks/useAccessibility';

interface AccessibilityPanelProps {
  open: boolean;
  onClose: () => void;
}

const FONT_LABELS = ['A', 'A+', 'A++'] as const;

export function AccessibilityPanel({ open, onClose }: AccessibilityPanelProps) {
  const { t } = useTranslation();
  const { settings, setFontSize, toggleHighContrast, toggleReduceTransparency } = useAccessibility();

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[70]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-label={t('a11y.title', 'Accessibility')}
        aria-modal="true"
        className="fixed right-4 top-20 z-[71] w-72 rounded-xl border border-border-default bg-bg-card p-5 shadow-xl"
      >
        <div className="mb-4 flex items-center gap-2">
          <Eye size={18} className="text-primary" />
          <h3 className="text-sm font-bold text-text-primary">
            {t('a11y.title', 'Accessibility')}
          </h3>
        </div>

        {/* Font size */}
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-2">
            <Type size={14} className="text-text-muted" />
            <span className="text-xs font-medium text-text-secondary">
              {t('a11y.fontSize', 'Text size')}
            </span>
          </div>
          <div className="flex gap-2">
            {([0, 1, 2] as const).map((size) => (
              <button
                key={size}
                onClick={() => setFontSize(size)}
                className={`flex-1 rounded-lg py-2 text-center font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                  settings.fontSize === size
                    ? 'bg-primary text-text-inverted'
                    : 'bg-bg-subtle text-text-secondary hover:text-text-primary'
                }`}
                style={{ fontSize: `${12 + size * 2}px` }}
                aria-pressed={settings.fontSize === size}
              >
                {FONT_LABELS[size]}
              </button>
            ))}
          </div>
        </div>

        {/* High contrast */}
        <button
          onClick={toggleHighContrast}
          className="mb-3 flex w-full items-center justify-between rounded-lg bg-bg-subtle px-4 py-3 text-left transition-colors hover:bg-bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-pressed={settings.highContrast}
        >
          <div className="flex items-center gap-2">
            <Contrast size={16} className="text-text-muted" />
            <span className="text-sm font-medium text-text-primary">
              {t('a11y.highContrast', 'High contrast')}
            </span>
          </div>
          <span
            className={`flex h-6 w-11 items-center rounded-full px-0.5 transition-colors ${
              settings.highContrast ? 'bg-primary' : 'bg-border-default'
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                settings.highContrast ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </span>
        </button>

        {/* Reduce transparency */}
        <button
          onClick={toggleReduceTransparency}
          className="flex w-full items-center justify-between rounded-lg bg-bg-subtle px-4 py-3 text-left transition-colors hover:bg-bg-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
          aria-pressed={settings.reduceTransparency}
        >
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-text-muted" />
            <span className="text-sm font-medium text-text-primary">
              {t('a11y.reduceTransparency', 'Reduce transparency')}
            </span>
          </div>
          <span
            className={`flex h-6 w-11 items-center rounded-full px-0.5 transition-colors ${
              settings.reduceTransparency ? 'bg-primary' : 'bg-border-default'
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full bg-white shadow transition-transform ${
                settings.reduceTransparency ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </span>
        </button>
      </div>
    </>
  );
}
