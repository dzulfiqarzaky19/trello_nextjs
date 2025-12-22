import { addColumn } from '@/app/actions';
import { FormWrapper } from '@/components/FormWrapper';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { ModalColumnForm } from '@/features/projects/components/ModalColumnForm';
import { Filter, List, PlusIcon, SquareKanban, User } from 'lucide-react';

export const BottomHeader = ({
  isProjectsPage,
}: {
  isProjectsPage?: boolean;
}) => {
  console.log(isProjectsPage);
  if (isProjectsPage) {
    return (
      <div className="flex items-center justify-between px-6">
        <div className="flex">
          <Button variant="ghost" className="cursor-pointer">
            <SquareKanban /> Board
          </Button>
          <Button variant="ghost" className="cursor-pointer">
            <List /> List
          </Button>
          <Button variant="ghost" className="cursor-pointer">
            <User /> My Task
          </Button>
          <Button variant="ghost" className="cursor-pointer">
            <Filter /> Filters
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Modal
            trigger={
              <Button variant="default" className="cursor-pointer">
                <PlusIcon /> New Column
              </Button>
            }
            modalClass="sm:max-w-xl"
          >
            <FormWrapper action={addColumn}>
              <ModalColumnForm />
            </FormWrapper>
          </Modal>
        </div>
      </div>
    );
  }

  return null;
};
