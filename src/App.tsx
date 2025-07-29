import { useState, useRef, createContext, Dispatch, SetStateAction, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import { t, Lang } from '@/lib/i18n';

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
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        {/* 顶部栏 */}
        <div className="app-header">
          <div className="app-title">
            {t(lang, 'siteName')}
          </div>
          <div className="app-header-actions">
            {/* 语言选择按钮 */}
            <div className="app-lang-menu-wrap">
              <button
                ref={langBtnRef}
                className="app-lang-btn"
                onClick={() => setLangMenuOpen(v => !v)}
              >
                <i className="fa-solid fa-language" style={{ marginRight: 4 }}></i>
                {LANGUAGES.find(l => l.code === lang)?.label}
                <i className="fa-solid fa-chevron-down" style={{ marginLeft: 4, fontSize: 12 }}></i>
              </button>
              {langMenuOpen && (
                <div className="app-lang-menu">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      className={"app-lang-menu-btn" + (l.code === lang ? ' selected' : '')}
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
              className="app-contact-btn"
              onClick={() => window.open('mailto:contact@example.com', '_blank')}
            >
              {t(lang, 'contactUs')}
            </button>
          </div>
        </div>
        {/* 下部分内容区域 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Routes>
            <Route path="/" element={<Home lang={lang} setLang={setLang} />} />
            <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
          </Routes>
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

