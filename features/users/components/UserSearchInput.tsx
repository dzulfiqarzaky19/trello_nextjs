'use client';

import { useState, useCallback } from 'react';
import { useSearchUsers } from '../api/useSearchUsers';
import { IUserSearchResult } from '../schema';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';

interface UserSearchInputProps {
  onSelect: (user: IUserSearchResult) => void;
  excludeIds?: string[];
  placeholder?: string;
}

export const UserSearchInput = ({
  onSelect,
  excludeIds = [],
  placeholder = 'Search by email or name...',
}: UserSearchInputProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useSearchUsers(debouncedQuery);

  const filteredUsers =
    data?.data.filter((user) => !excludeIds.includes(user.id)) || [];

  const handleSelect = useCallback(
    (user: IUserSearchResult) => {
      onSelect(user);
      setQuery('');
      setIsOpen(false);
    },
    [onSelect]
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverAnchor asChild>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="pl-10 w-full"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
      </PopoverAnchor>

      {debouncedQuery.length >= 2 && (
        <PopoverContent
          className="p-0 max-h-64 overflow-y-auto w-(--radix-popover-trigger-width) shadow-lg border-t-0 rounded-t-none"
          align="start"
          sideOffset={0}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-col w-full">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No users found
              </div>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelect(user)}
                  className="flex items-center gap-3 p-3 w-full hover:bg-accent transition-colors text-left border-b last:border-0"
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={user.avatar_url || ''} />
                    <AvatarFallback>
                      {user.full_name?.charAt(0) ||
                        user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">
                      {user.full_name || 'Unknown User'}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      )}
    </Popover>
  );
};
