import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { useI18n } from '@/i18n';

const sections = [
  { titleKey: 'privacy.s1Title', bodyKeys: ['privacy.s1B1', 'privacy.s1B2'] },
  { titleKey: 'privacy.s2Title', bodyKeys: ['privacy.s2B1', 'privacy.s2B2'] },
  { titleKey: 'privacy.s3Title', bodyKeys: ['privacy.s3B1', 'privacy.s3B2'] },
  { titleKey: 'privacy.s4Title', bodyKeys: ['privacy.s4B1'] },
  { titleKey: 'privacy.s5Title', bodyKeys: ['privacy.s5B1'] },
] as const;

export function PrivacyPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="page-shell input-page-shell">
      <div className="tutorial-topbar-shell">
        <PageTopbar title={t('privacy.title')} wide onBack={() => navigate('/')} />
      </div>

      <div className="bazi-view-container tutorial-page-container">
        <section className="history-page-section tutorial-page-section">
          <div className="tutorial-intro-card">
            <p>{t('privacy.updatedAt')}</p>
          </div>

          <div className="tutorial-section-heading">
            <h3>{t('privacy.corePrinciples')}</h3>
          </div>
          <article className="tutorial-ai-card">
            <ul className="tutorial-bullet-list">
              <li>{t('privacy.principle1')}</li>
              <li>{t('privacy.principle2')}</li>
            </ul>
          </article>

          {sections.map((section) => (
            <div key={section.titleKey}>
              <div className="tutorial-section-heading">
                <h3>{t(section.titleKey)}</h3>
              </div>
              <article className="tutorial-faq-card">
                {section.bodyKeys.map((key) => (
                  <p key={key}>{t(key)}</p>
                ))}
              </article>
            </div>
          ))}

          <div className="tutorial-section-heading">
            <h3>{t('privacy.disclaimerHead')}</h3>
          </div>
          <article className="tutorial-ai-card">
            <p>{t('privacy.disclaimerNote')}</p>
            <p>{t('privacy.disclaimerBody')}</p>
          </article>
        </section>
      </div>
    </div>
  );
}
