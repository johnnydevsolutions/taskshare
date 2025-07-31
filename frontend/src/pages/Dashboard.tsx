import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, List, Users, Trash2, Edit2, Share2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { TaskList } from '../types';
import api from '../lib/api';
import CreateListModal from '../components/CreateListModal';
import ShareListModal from '../components/ShareListModal';
import ConfirmModal from '../components/ConfirmModal';

// Function to create URL-friendly slugs
const createSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .substring(0, 50); // Limit length
};

const Dashboard: React.FC = () => {
  const [ownedLists, setOwnedLists] = useState<TaskList[]>([]);
  const [sharedLists, setSharedLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedList, setSelectedList] = useState<TaskList | null>(null);
  const [editingList, setEditingList] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await api.get('/lists');
      setOwnedLists(response.data.ownedLists);
      setSharedLists(response.data.sharedLists);
    } catch (error) {
      toast.error('Erro ao carregar listas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateList = async (title: string) => {
    try {
      const response = await api.post('/lists', { title });
      setOwnedLists([response.data, ...ownedLists]);
      setShowCreateModal(false);
      toast.success('Lista criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar lista');
    }
  };

  const handleDeleteList = async (listId: string) => {
    setListToDelete(listId);
    setShowDeleteModal(true);
  };

  const confirmDeleteList = async () => {
    if (!listToDelete) return;

    try {
      await api.delete(`/lists/${listToDelete}`);
      setOwnedLists(ownedLists.filter(list => list.id !== listToDelete));
      toast.success('Lista excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir lista');
    } finally {
      setListToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const handleEditList = async (listId: string) => {
    if (!editTitle.trim()) return;

    try {
      const response = await api.put(`/lists/${listId}`, { title: editTitle });
      setOwnedLists(ownedLists.map(list => 
        list.id === listId ? response.data : list
      ));
      setEditingList(null);
      setEditTitle('');
      toast.success('Lista atualizada com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar lista');
    }
  };

  const startEdit = (list: TaskList) => {
    setEditingList(list.id);
    setEditTitle(list.title);
  };

  const cancelEdit = () => {
    setEditingList(null);
    setEditTitle('');
  };

  const handleShare = (list: TaskList) => {
    setSelectedList(list);
    setShowShareModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Filter lists based on search term
  const filteredOwnedLists = ownedLists.filter(list =>
    list.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSharedLists = sharedLists.filter(list =>
    list.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Minhas Listas</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Lista
        </button>
      </div>

      {/* Search Lists */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar listas..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Owned Lists */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Listas Próprias
          {searchTerm && (
            <span className="text-sm text-gray-500 ml-2">
              ({filteredOwnedLists.length} de {ownedLists.length})
            </span>
          )}
        </h2>
        {filteredOwnedLists.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <List className="mx-auto h-12 w-12 text-gray-400" />
            {searchTerm ? (
              <>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma lista encontrada</h3>
                <p className="mt-1 text-sm text-gray-500">Tente buscar por outro termo.</p>
              </>
            ) : (
              <>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma lista</h3>
                <p className="mt-1 text-sm text-gray-500">Comece criando uma nova lista de tarefas.</p>
              </>
            )}
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Lista
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOwnedLists.map((list) => (
              <div key={list.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {editingList === list.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          onKeyPress={(e) => e.key === 'Enter' && handleEditList(list.id)}
                          autoFocus
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditList(list.id)}
                            className="text-xs px-2 py-1 bg-primary-600 text-white rounded hover:bg-primary-700"
                          >
                            Salvar
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="text-xs px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Link to={`/list/${createSlug(list.title)}/${list.id}`}>
                        <h3 className="text-lg font-medium text-gray-900 hover:text-primary-600">
                          {list.title}
                        </h3>
                      </Link>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {list._count.tasks} tarefa{list._count.tasks !== 1 ? 's' : ''}
                    </p>
                    {list.shares && list.shares.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        Compartilhada com {list.shares.length} pessoa{list.shares.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  
                  {editingList !== list.id && (
                    <div className="flex space-x-1 ml-2">
                      <button
                        onClick={() => startEdit(list)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleShare(list)}
                        className="p-1 text-gray-400 hover:text-blue-600"
                        title="Compartilhar"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="p-1 text-gray-400 hover:text-red-600"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shared Lists */}
      {(filteredSharedLists.length > 0 || (sharedLists.length > 0 && searchTerm)) && (
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Listas Compartilhadas
            {searchTerm && (
              <span className="text-sm text-gray-500 ml-2">
                ({filteredSharedLists.length} de {sharedLists.length})
              </span>
            )}
          </h2>
          {filteredSharedLists.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900">Nenhuma lista compartilhada encontrada</h3>
              <p className="text-sm text-gray-500">Tente buscar por outro termo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSharedLists.map((list) => (
              <div key={list.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Link to={`/list/${createSlug(list.title)}/${list.id}`}>
                      <h3 className="text-lg font-medium text-gray-900 hover:text-primary-600">
                        {list.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {list._count.tasks} tarefa{list._count.tasks !== 1 ? 's' : ''}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Por {list.owner.name}
                    </p>
                  </div>
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateListModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateList}
        />
      )}

      {showShareModal && selectedList && (
        <ShareListModal
          list={selectedList}
          onClose={() => {
            setShowShareModal(false);
            setSelectedList(null);
          }}
          onUpdate={fetchLists}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteList}
        title="Excluir Lista"
        message="Tem certeza que deseja excluir esta lista? Todas as tarefas e comentários serão perdidos permanentemente."
        confirmText="Excluir"
        cancelText="Cancelar"
        type="danger"
      />
    </div>
  );
};

export default Dashboard;