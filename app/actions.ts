'use server';

export async function addColumn(formData: FormData) {
  const columnTitle = formData.get('columnTitle');
  const headerColor = formData.get('headerColor');
  const description = formData.get('description');
  console.log('Adding new column', { columnTitle, headerColor, description });
}

export async function addTask(formData: FormData) {
  const title = formData.get('title');
  const description = formData.get('description');
  console.log('Adding new task', { title, description });
}

export async function updateTask(formData: FormData) {
  const id = formData.get('id');
  const title = formData.get('title');
  const description = formData.get('description');
  console.log('Updating task', { id, title, description });
}
