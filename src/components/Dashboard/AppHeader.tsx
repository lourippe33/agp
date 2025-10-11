import logoAgp from '../../assets/logo-agp.png';

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export function AppHeader({ title, subtitle, rightElement }: AppHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-[#2B7BBE] via-[#4A9CD9] to-[#5FA84D] pt-6 pb-8 px-6 rounded-b-3xl">
      <div className="flex items-center justify-between mb-4">
        <img
          src={logoAgp}
          alt="AGP Logo"
          className="h-12 w-12 rounded-lg shadow-md"
        />
        {rightElement}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {title}
        </h1>
        {subtitle && (
          <p className="text-white text-opacity-90">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
