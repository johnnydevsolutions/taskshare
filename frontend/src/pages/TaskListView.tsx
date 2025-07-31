import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Check, X, Edit2, Trash2, MessageCircle, Search, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import toast from 'react-hot-toast';
import { TaskList, Task } from '../types';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import TaskComments from '../components/TaskComments';
import ConfirmModal from '../components/ConfirmModal';
import Breadcrumbs from '../components/Breadcrumbs';

const TaskListView: React.FC = () => {
  const { id, slug } = useParams<{ id: string; slug?: string }>();
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [list, setList] = useState<TaskList | null>(null);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showComments, setShowComments] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchListAndTasks();
    }
  }, [id]);

  const fetchListAndTasks = async () => {
    try {
      console.log('📥 Fetching list and tasks for ID:', id);
      const [listsResponse, tasksResponse] = await Promise.all([
        api.get('/lists'),
        api.get(`/lists/${id}/tasks`)
      ]);

      // Ensure tasks is always an array
      const tasksData = Array.isArray(tasksResponse.data) ? tasksResponse.data : [];
      console.log('📋 Tasks loaded:', tasksData);

      // Find the list from owned or shared lists
      const allLists = [...listsResponse.data.ownedLists, ...listsResponse.data.sharedLists];
      const currentList = allLists.find(l => l.id === id);

      if (!currentList) {
        toast.error('Lista não encontrada');
        return;
      }

      setList(currentList);
      setTasks(tasksData);
    } catch (error) {
      console.error('❌ Error loading data:', error);
      toast.error('Erro ao carregar dados');
      setTasks([]); // Ensure tasks is always an array even on error
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await api.post(`/lists/${id}/tasks`, { title: newTaskTitle.trim() });
      // Ensure the new task has all required fields
      const newTask = {
        ...response.data,
        title: response.data.title || newTaskTitle.trim(), // Ensure title is never undefined
        _count: response.data._count || { comments: 0 }
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      toast.success('Tarefa criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar tarefa');
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      console.log('🔄 Toggling task:', taskId);
      const response = await api.patch(`/tasks/${taskId}/toggle`);
      console.log('✅ Toggle response:', response.data);

      // Check if response is valid JSON and not HTML
      if (typeof response.data === 'string' || !response.data.id) {
        console.error('❌ Invalid response format:', response.data);
        toast.error('Erro na resposta do servidor');
        return;
      }

      // Ensure the updated task has all required fields
      const updatedTask = {
        ...response.data,
        title: response.data.title || '', // Ensure title is never undefined
        _count: response.data._count || { comments: 0 }
      };

      console.log('📝 Updated task:', updatedTask);
      setTasks(prevTasks => {
        if (!Array.isArray(prevTasks)) {
          console.error('❌ Tasks is not an array:', prevTasks);
          return [];
        }
        return prevTasks.map(task =>
          task.id === taskId ? updatedTask : task
        );
      });
      
      toast.success(updatedTask.completed ? 'Tarefa marcada como concluída!' : 'Tarefa marcada como pendente!');
    } catch (error) {
      console.error('❌ Toggle error:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const handleEditTask = async (taskId: string) => {
    if (!editingTitle.trim()) return;

    try {
      const response = await api.put(`/tasks/${taskId}`, { title: editingTitle });
      // Ensure the updated task has all required fields
      const updatedTask = {
        ...response.data,
        title: response.data.title || editingTitle, // Ensure title is never undefined
        _count: response.data._count || { comments: 0 }
      };
      setTasks(prevTasks => {
        if (!Array.isArray(prevTasks)) {
          console.error('❌ Tasks is not an array:', prevTasks);
          return [];
        }
        return prevTasks.map(task =>
          task.id === taskId ? updatedTask : task
        );
      });
      setEditingTaskId(null);
      setEditingTitle('');
      toast.success('Tarefa atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setShowDeleteConfirm(taskId);
  };

  const confirmDeleteTask = async () => {
    if (!showDeleteConfirm) return;

    try {
      await api.delete(`/tasks/${showDeleteConfirm}`);
      setTasks(prevTasks => {
        if (!Array.isArray(prevTasks)) {
          console.error('❌ Tasks is not an array:', prevTasks);
          return [];
        }
        return prevTasks.filter(task => task.id !== showDeleteConfirm);
      });
      toast.success('Tarefa excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir tarefa');
    } finally {
      setShowDeleteConfirm(null);
    }
  };

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const openComments = (task: Task) => {
    setShowComments(task.id);
  };

  const closeComments = () => {
    setShowComments(null);
    // Refresh tasks to update comment count
    fetchListAndTasks();
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for better UX
    setTasks(items);

    try {
      const taskIds = items.map(task => task.id);
      await api.patch(`/lists/${id}/tasks/reorder`, { taskIds });
      console.log('✅ Tasks reordered successfully');
    } catch (error) {
      console.error('❌ Reorder error:', error);
      toast.error('Erro ao reordenar tarefas');
      // Refresh to get correct order from server
      fetchListAndTasks();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-gray-900">Lista não encontrada</h2>
        <Link to="/" className="text-primary-600 hover:text-primary-500 mt-2 inline-block">
          Voltar para o dashboard
        </Link>
      </div>
    );
  }

  const isOwner = list.ownerId === user?.id;
  const completedTasks = Array.isArray(tasks) ? tasks.filter(task => task.completed).length : 0;

  // Filter tasks based on search term
  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task =>
    task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: list.title, current: true }
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{list.title}</h1>
            <p className="text-sm text-gray-500">
              {searchTerm ? (
                <>
                  {filteredTasks.length} de {Array.isArray(tasks) ? tasks.length : 0} tarefa{(Array.isArray(tasks) ? tasks.length : 0) !== 1 ? 's' : ''} • {completedTasks} concluída{completedTasks !== 1 ? 's' : ''}
                </>
              ) : (
                <>
                  {Array.isArray(tasks) ? tasks.length : 0} tarefa{(Array.isArray(tasks) ? tasks.length : 0) !== 1 ? 's' : ''} • {completedTasks} concluída{completedTasks !== 1 ? 's' : ''}
                </>
              )}
              {!isOwner && <span className="ml-2">• Compartilhada por {list.owner.name}</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Add Task */}
      <div className="space-y-4">
        {/* Search Tasks */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tarefas..."
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* New Task Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <form onSubmit={handleCreateTask} className="flex space-x-3">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Adicionar nova tarefa..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!newTaskTitle.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </button>
          </form>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg border border-gray-200">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
                <p className="text-gray-500">Tente buscar por outro termo.</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa ainda</h3>
                <p className="text-gray-500">Adicione sua primeira tarefa acima.</p>
              </>
            )}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="divide-y divide-gray-200"
                >
                  {filteredTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 transition-colors ${
                            snapshot.isDragging
                              ? 'bg-blue-50 shadow-lg rounded-lg'
                              : 'hover:bg-gray-50 cursor-pointer'
                          }`}
                          onClick={() => openComments(task)}
                        >
                          <div className="flex items-center space-x-3">
                            {/* Drag Handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>

                            <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleTask(task.id);
                    }}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : 'border-gray-300 hover:border-green-500 bg-white'
                    }`}
                  >
                    {task.completed && <Check className="h-3 w-3 text-white" />}
                  </button>

                  <div className="flex-1 min-w-0">
                    {editingTaskId === task.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                          onKeyDown={(e) => e.key === 'Enter' && handleEditTask(task.id)}
                          autoFocus
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask(task.id);
                          }}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            cancelEdit();
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${
                            task.completed
                              ? 'line-through text-gray-700 bg-gray-100 px-2 py-1 rounded border border-gray-200'
                              : 'text-gray-900'
                          }`}
                        >
                          {task.title}
                        </span>
                        
                        <div className="flex items-center space-x-1">
                          {task._count?.comments > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openComments(task);
                              }}
                              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-primary-600"
                            >
                              <MessageCircle className="h-3 w-3" />
                              <span>{task._count?.comments || 0}</span>
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openComments(task);
                            }}
                            className="p-1 text-gray-400 hover:text-primary-600"
                            title="Comentários"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(task);
                            }}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                          </div>
                        </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Comments Modal */}
      {showComments && (
        <TaskComments
          task={tasks.find(t => t.id === showComments)!}
          onClose={closeComments}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={confirmDeleteTask}
        title="Excluir Tarefa"
        message="Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default TaskListView;