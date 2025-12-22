"use server"

export async function addColumn(formData: FormData) {
    const columnTitle = formData.get("columnTitle")
    console.log("Adding new column", { columnTitle })
}

export async function addTask(formData: FormData) {
    const title = formData.get("title")
    const description = formData.get("description")
    console.log("Adding new task", { title, description })
}
