import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';

export const CardAvatar = ({
  assignees,
  isEditable,
}: {
  assignees: { id: string; name: string; image: string }[];
  isEditable?: boolean;
}) => {
  if (!assignees || assignees.length === 0) return null;

  const maxVisible = 2;
  const visible = assignees.slice(0, maxVisible);
  const remaining = assignees.length - maxVisible;

  return (
    <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale">
      {visible.map((user, index) => {
        if (index === maxVisible - 1 && remaining > 0 && !isEditable) {
          return (
            <Avatar key="extra">
              <AvatarFallback>+{remaining + 1}</AvatarFallback>
            </Avatar>
          );
        }

        return (
          <Avatar key={user.id}>
            <AvatarImage src={user.image} alt={user.name} />
            <AvatarFallback>
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        );
      })}

      {isEditable && (
        <Avatar key="extra">
          <AvatarFallback className="cursor-pointer bg-gray-200 shadow-sm hover:shadow">
            +
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
