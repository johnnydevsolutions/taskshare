import React, { useState, useEffect } from 'react';
import { X, UserMinus } from 'lucide-react';
import toast from 'react-hot-toast';
import { TaskList, ListShare } from '../types';
import api from '../lib/api';

interface ShareListModalProps {
  list: TaskList;
  onClose: () => void;
  onUpdate: () => void;
}

const ShareListModal: React.FC<ShareListModalProps> = ({ list, onClose, onUpdate }) => {
  const [email, setEmail] = useState('');
  const [shares, setShares] = useState<ListShare[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShares();
  }, []);

  const fetchShares = async () => {
    try {
      // Get updated list data with shares
      const response = await api.get('/lists');
      const updatedList = response.data.ownedLists.find((l: TaskList) => l.id === list.id);
      if (updatedList && updatedList.shares) {
        setShares(updatedList.shares);
      }
    } catch (error) {
      toast.error('Erro ao carregar compartilhamentos');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post(`/lists/${list.id}/share`, { email: email.trim() });
      setEmail('');
      await fetchShares();
      onUpdate();
      toast.success('Lista compartilhada com sucesso!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao compartilhar lista');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveShare = async (userId: string) => {
    try {
      await api.delete(`/lists/${list.id}/share/${userId}`);
      await fetchShares();
      onUpdate();
      toast.success('Acesso removido com sucesso!');
    } catch (error) {
      toast.error('Erro ao remover acesso');
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Compartilhar: {list.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleShare} className="mb-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email do usuário
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="usuario@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={!email.trim() || isSubmitting}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Compartilhando...' : 'Compartilhar'}
          </button>
        </form>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Usuários com acesso ({shares.length})
          </h4>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-500"></div>
            </div>
          ) : shares.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              Nenhum usuário com acesso
            </p>
          ) : (
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {shares.map((share) => (
                <div key={share.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{share.user.name}</p>
                    <p className="text-xs text-gray-500">{share.user.email}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveShare(share.user.id)}
                    className="p-1 text-gray-400 hover:text-red-600"
                    title="Remover acesso"
                  >
                    <UserMinus className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareListModal;