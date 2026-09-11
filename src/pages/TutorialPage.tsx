import { useNavigate } from 'react-router-dom';
import { PageTopbar } from '@/components/PageTopbar';
import { useI18n } from '@/i18n';

const workflowSteps = [
  { titleKey: 'tutorial.step1Title', descKey: 'tutorial.step1Desc' },
  { titleKey: 'tutorial.step2Title', descKey: 'tutorial.step2Desc' },
  { titleKey: 'tutorial.step3Title', descKey: 'tutorial.step3Desc' },
] as const;

const modeGuides = [
  {
    titleKey: 'tutorial.mode1Title',
    descKey: 'tutorial.mode1Desc',
    bullets: ['tutorial.mode1B1', 'tutorial.mode1B2'],
  },
  {
    titleKey: 'tutorial.mode2Title',
    descKey: 'tutorial.mode2Desc',
    bullets: ['tutorial.mode2B1', 'tutorial.mode2B2', 'tutorial.mode2B3'],
  },
  {
    titleKey: 'tutorial.mode3Title',
    descKey: 'tutorial.mode3Desc',
    bullets: ['tutorial.mode3B1', 'tutorial.mode3B2', 'tutorial.mode3B3'],
  },
  {
    titleKey: 'tutorial.mode4Title',
    descKey: 'tutorial.mode4Desc',
    bullets: ['tutorial.mode4B1', 'tutorial.mode4B2', 'tutorial.mode4B3'],
  },
] as const;

const promptUsageTips = ['tutorial.tip1', 'tutorial.tip2', 'tutorial.tip3'] as const;

const commonQuestions = [
  { qKey: 'tutorial.faq1Q', aKey: 'tutorial.faq1A' },
  { qKey: 'tutorial.faq2Q', aKey: 'tutorial.faq2A' },
  { qKey: 'tutorial.faq3Q', aKey: 'tutorial.faq3A' },
] as const;

export function TutorialPage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <div className="page-shell input-page-shell">
      <div className="tutorial-topbar-shell">
        <PageTopbar title={t('tutorial.title')} wide onBack={() => navigate('/')} />
      </div>

      <div className="bazi-view-container tutorial-page-container">
        <section className="history-page-section tutorial-page-section">
          <div className="tutorial-intro-card">
            <p>{t('tutorial.intro')}</p>
          </div>

          <div className="tutorial-section-heading">
            <h3>{t('tutorial.headWorkflow')}</h3>
          </div>

          <div className="tutorial-step-list">
            {workflowSteps.map((step, index) => (
              <article className="tutorial-step-card" key={step.titleKey}>
                <span className="tutorial-step-index">0{index + 1}</span>
                <div className="tutorial-step-copy">
                  <h3>{t(step.titleKey)}</h3>
                  <p>{t(step.descKey)}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="tutorial-section-heading">
            <h3>{t('tutorial.headModes')}</h3>
          </div>

          <div className="tutorial-mode-grid">
            {modeGuides.map((mode) => (
              <article className="tutorial-mode-card" key={mode.titleKey}>
                <h4>{t(mode.titleKey)}</h4>
                <p>{t(mode.descKey)}</p>
                <ul className="tutorial-bullet-list">
                  {mode.bullets.map((item) => (
                    <li key={item}>{t(item)}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="tutorial-section-heading">
            <h3>{t('tutorial.headTips')}</h3>
          </div>

          <article className="tutorial-ai-card">
            <ul className="tutorial-bullet-list tutorial-bullet-list-compact">
              {promptUsageTips.map((item) => (
                <li key={item}>{t(item)}</li>
              ))}
            </ul>
          </article>

          <div className="tutorial-section-heading">
            <h3>{t('tutorial.headFaq')}</h3>
          </div>

          <div className="tutorial-faq-list">
            {commonQuestions.map((item) => (
              <article className="tutorial-faq-card" key={item.qKey}>
                <h4>{t(item.qKey)}</h4>
                <p>{t(item.aKey)}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
