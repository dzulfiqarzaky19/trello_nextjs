interface IAuthHeaderProps {
  title: string;
  description: string;
}

export const AuthHeader = ({ title, description }: IAuthHeaderProps) => (
  <div className="flex flex-col items-center gap-1 text-center">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-muted-foreground text-sm text-balance">{description}</p>
  </div>
);
