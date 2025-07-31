export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface TaskList {
  id: string;
  title: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    name: string;
    email: string;
  };
  shares?: ListShare[];
  _count: {
    tasks: number;
  };
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  listId: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    comments: number;
  };
}

export interface ListShare {
  id: string;
  listId: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}