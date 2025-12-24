import { Header } from '@/components/header/Header';
import { SettingsMain } from '@/features/settings/SettingsMain';
import { SETTINGS_PAGE_HEADER } from '@/lib/const/settingsPage';

export default function SettingsPage() {
  return (
    <div className="min-h-screen font-sans bg-zinc-100 dark:bg-primary grid grid-rows-[auto_1fr]">
      <Header
        label={SETTINGS_PAGE_HEADER.label}
        description={SETTINGS_PAGE_HEADER.description}
      />

      <SettingsMain />
    </div>
  );
}
