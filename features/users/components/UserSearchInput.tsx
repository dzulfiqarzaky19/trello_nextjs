'use client';

import { useState, useCallback } from 'react';
import { useSearchUsers } from '../api/useSearchUsers';
import { IUserSearchResult } from '../schema';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

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

    const filteredUsers = data?.data.filter(
        (user) => !excludeIds.includes(user.id)
    ) || [];

    const handleSelect = useCallback((user: IUserSearchResult) => {
        onSelect(user);
        setQuery('');
        setIsOpen(false);
    }, [onSelect]);

    return (
        <div className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="pl-10"
                />
                {isLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                )}
            </div>

            {isOpen && debouncedQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
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
                                className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar_url || ''} />
                                    <AvatarFallback>
                                        {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
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
            )}

            {/* Backdrop to close dropdown */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};
