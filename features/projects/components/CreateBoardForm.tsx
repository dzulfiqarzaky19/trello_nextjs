'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createBoard } from '../actions';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const CreateBoardForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    try {
      const result = await createBoard(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Board created successfully!');
        router.refresh();
        // Close modal by resetting form or using modal context
      }
    } catch (e) {
      toast.error('Failed to create board');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Create New Board</h2>
        <p className="text-sm text-muted-foreground">
          Start organizing your tasks in a new project board.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Board Title *</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Website Redesign"
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Cover Image URL (optional)</Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://example.com/image.jpg"
          disabled={loading}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="submit"
          disabled={loading}
          className="bg-red-500 hover:bg-red-600"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Board
        </Button>
      </div>
    </form>
  );
};
