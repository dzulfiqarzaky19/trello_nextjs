import { ProfileForm } from './components/ProfileForm';
import { Security } from './components/Security';

export const SettingsMain = () => {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="space-y-12">
        <ProfileForm />

        <Security />
      </div>
    </main>
  );
};
