import { ProfileForm } from './components/ProfileForm';
import { SecurityForm } from './components/SecurityForm';

export const SettingsMain = () => {
  return (
    <main className="p-8 max-w-4xl">
      <div className="space-y-12">
        <ProfileForm />
        <SecurityForm />
      </div>
    </main>
  );
};
