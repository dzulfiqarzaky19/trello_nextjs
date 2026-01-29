import { Column } from '@/features/columns/types';

interface UpdateTaskFieldParams {
    task: { title: string; description: string | null };
    title?: string;
    description?: string;
}

interface MoveTaskParams {
    newColumns: Column[];
    sourceColumn: Column;
    destColumn: Column;
    movedTask: Column['tasks'][number];
    sourceTaskIndex: number;
    position: number;
}

interface OptimisticTaskParams {
    old: Column[] | undefined;
    param: {
        taskId: string;
    };
    json: {
        columnId?: string;
        position?: number;
        description?: string;
        title?: string;
    };
}


const updateTaskField = ({
    task,
    title,
    description,
}: UpdateTaskFieldParams) => {
    if (title) task.title = title;
    if (description) task.description = description;
};



const moveTasks = ({
    newColumns,
    sourceColumn,
    destColumn,
    movedTask,
    sourceTaskIndex,
    position,
}: MoveTaskParams) => {
    sourceColumn.tasks.splice(sourceTaskIndex, 1);

    if (!destColumn.tasks) destColumn.tasks = [];

    const insertIndex = Math.min(
        Math.max(0, position - 1),
        destColumn.tasks.length
    );
    destColumn.tasks.splice(insertIndex, 0, movedTask);

    destColumn.tasks.forEach((t, idx) => {
        t.position = idx + 1;
    });

    if (sourceColumn.id !== destColumn.id) {
        sourceColumn.tasks.forEach((t, idx) => {
            t.position = idx + 1;
        });
    }

    return newColumns;
};


export const optimisticTask = ({
    old,
    param,
    json,
}: OptimisticTaskParams) => {
    if (!old) return old;

    const newColumns: Column[] = structuredClone(old);
    const { taskId } = param;
    const { columnId, position, description, title } = json;

    const sourceColumn = newColumns.find((col) =>
        col.tasks?.some((t) => t.id === taskId)
    );

    if (!sourceColumn || !sourceColumn.tasks) return newColumns;

    const sourceTaskIndex = sourceColumn.tasks.findIndex(
        (t) => t.id === taskId
    );

    if (sourceTaskIndex === -1) return newColumns;

    const movedTask = sourceColumn.tasks[sourceTaskIndex];

    if (!movedTask) return newColumns;

    updateTaskField({ task: movedTask, title, description });

    if (!columnId || !position) return newColumns;

    const destColumn = newColumns.find((c) => c.id === columnId);

    if (!destColumn) return newColumns;

    moveTasks({
        newColumns,
        sourceColumn,
        destColumn,
        movedTask,
        sourceTaskIndex,
        position,
    });

    return newColumns;
}