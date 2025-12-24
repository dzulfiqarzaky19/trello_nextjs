import { ProfileForm } from './components/ProfileForm';
import { SecurityForm } from './components/SecurityForm';

interface SettingsMainProps {
  profile: any; // We can define strict types later or assume standard profile shape
  userEmail?: string;
}

export const SettingsMain = ({ profile, userEmail }: SettingsMainProps) => {
  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="space-y-12">
        <ProfileForm profile={profile} userEmail={userEmail} />
        <SecurityForm />
      </div>
    </main>
  );
};
