import { useState, useRef, createContext, Dispatch, SetStateAction, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import ContactUs from '@/components/ContactUs/ContactUs';
import { t, Lang } from '@/lib/i18n';
import styles from './App.module.css';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  logout: () => {},
});


export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lang, setLang] = useState<Lang>(getDefaultLang());

  // 切换语言时设置html[data-lang]属性，控制字体
  useEffect(() => {
    document.documentElement.setAttribute('data-lang', lang);
  }, [lang]);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langBtnRef = useRef<HTMLButtonElement>(null);
  const LANGUAGES: { code: Lang; label: string }[] = [
    { code: 'zh', label: t('zh', 'language') },
    { code: 'en', label: t('en', 'language') },
  ];

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      <div className={styles['app-root']}>
        {/* 顶部栏 */}
        <div className={styles['app-header']}>
          <div className={styles['app-title']}>
            {t(lang, 'siteName')}
          </div>
          <div className={styles['app-header-actions']}>
            {/* 语言选择按钮 */}
            <div className={styles['app-lang-menu-wrap']}>
              <button
                ref={langBtnRef}
                className={styles['app-lang-btn']}
                onClick={() => setLangMenuOpen(v => !v)}
              >
                <i className="fa-solid fa-language" style={{ marginRight: 4 }}></i>
                {LANGUAGES.find(l => l.code === lang)?.label}
                <i className="fa-solid fa-chevron-down" style={{ marginLeft: 4, fontSize: 12 }}></i>
              </button>
              {langMenuOpen && (
                <div className={styles['app-lang-menu']}>
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      className={styles['app-lang-menu-btn'] + (l.code === lang ? ' ' + styles['selected'] : '')}
                      onClick={() => { setLang(l.code); setLangMenuOpen(false); }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* 联系我们按钮 */}
            <button
              className={styles['app-contact-btn']}
              onClick={() => setContactOpen(true)}
            >
              {t(lang, 'contactUs')}
            </button>
          </div>
        </div>
        {/* 联系我们弹窗 */}
        <ContactUs isOpen={contactOpen} onClose={() => setContactOpen(false)} lang={lang} />
        {/* 下部分内容区域 */}
        <div className={styles['app-content']}>
          <Routes>
            <Route path="/" element={<Home lang={lang} setLang={setLang} />} />
            <Route path="/other" element={<div style={{textAlign:'center',fontSize:'1.25rem'}}>Other Page - Coming Soon</div>} />
          </Routes>
        </div>
        <div className={styles['app-footer']}>
          <p>{t(lang, 'siteName')} &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </AuthContext.Provider>
  );
}
function getDefaultLang(): Lang {
  const supportedLangs: Lang[] = ['zh', 'en'];
  const browserLang = navigator.language.slice(0, 2).toLowerCase();
  return supportedLangs.includes(browserLang as Lang) ? (browserLang as Lang) : 'en';
}

