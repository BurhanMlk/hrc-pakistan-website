import { createContext, useContext, useEffect, useState } from 'react';
import { publicApi } from '../services/publicApi.js';
import { ORG } from '../config/theme.js';

const SettingsContext = createContext({ settings: {}, loading: true });

const DEFAULT_SETTINGS = {
  organizationName: ORG.name,
  organizationShortName: ORG.shortName,
  tagline: ORG.tagline,
  hero: {},
  statistics: [],
  contact: {},
  socialLinks: {},
  introduction: '',
  footer: {},
  payment: {},
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .settings()
      .then((data) => setSettings({ ...DEFAULT_SETTINGS, ...data }))
      .catch(() => setSettings(DEFAULT_SETTINGS))
      .finally(() => setLoading(false));
  }, []);

  return <SettingsContext.Provider value={{ settings, loading }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}

export default SettingsContext;
