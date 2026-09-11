import { useI18n } from '@/i18n';

type PageTopbarProps = {
  title: string;
  onBack: () => void;
  wide?: boolean;
};

export function PageTopbar(props: PageTopbarProps) {
  const { title, onBack, wide = false } = props;
  const { t } = useI18n();

  return (
    <div className={`page-topbar${wide ? ' page-topbar-wide' : ''}`}>
      <button type="button" className="page-topbar-back" onClick={onBack}>
        {t('common.back')}
      </button>
      <h1 className="page-topbar-title">{title}</h1>
    </div>
  );
}
