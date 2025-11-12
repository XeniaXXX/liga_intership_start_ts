const API_URL = "https://tasks-service-maks1394.amvera.io/tasks";

interface Task {
  name?: string;
  info?: string;
  isImportant?: boolean;
  isCompleted?: boolean;
}

interface NewTask {
  name: string;
  info?: string;
  isImportant?: boolean;
  isCompleted?: boolean;
}

class FetchRequests {
  constructor(private _baseUrl: string = API_URL) {}

  async fetchRequest<ReturnTypeData>(
    url: string,
    method = "GET",
    body: object | null = null
  ): Promise<ReturnTypeData | undefined> {
    const options: RequestInit = { method };
    if (method !== "GET" && body) {
      options.headers = {
        "Content-Type": "application/json;charset=UTF-8",
      };
      options.body = JSON.stringify(body);
    }
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }
      return (await response.json()) as ReturnTypeData;
    } catch (error) {
      console.error("Request failed:", error);
      return undefined;
    }
  }

  async getAllTasks(params?: Task) {
    const query = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    const url = query ? `${this._baseUrl}?${query}` : this._baseUrl;
    return this.fetchRequest(url, "GET");
  }

  async postTask(newTask: NewTask) {
    return this.fetchRequest<Task>(this._baseUrl, "POST", newTask);
  }

  async getTaskById(id: string | number) {
    return this.fetchRequest<Task>(`${this._baseUrl}/${id}`, "GET");
  }

  async patchTask(id: string | number, changeData: Task) {
    return this.fetchRequest<Task>(
      `${this._baseUrl}/${id}`,
      "PATCH",
      changeData
    );
  }

  async deleteTask(id: string | number) {
    return this.fetchRequest<void>(`${this._baseUrl}/${id}`, "DELETE");
  }
}

