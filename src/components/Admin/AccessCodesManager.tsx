import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Key, Plus, Trash2, Copy, Check } from 'lucide-react';

interface AccessCode {
  id: string;
  code: string;
  is_used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
  notes: string | null;
}

export function AccessCodesManager() {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [numberOfCodes, setNumberOfCodes] = useState(1);

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('access_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCodes(data || []);
    } catch (error) {
      console.error('Error loading codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCodes = async () => {
    setGenerating(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('email')
        .eq('id', userData.user?.id)
        .single();

      const newCodes = [];
      for (let i = 0; i < numberOfCodes; i++) {
        const code = generateRandomCode();
        newCodes.push({
          code,
          created_by: profileData?.email || 'admin',
          notes: `Généré le ${new Date().toLocaleDateString('fr-FR')}`
        });
      }

      const { error } = await supabase
        .from('access_codes')
        .insert(newCodes);

      if (error) throw error;

      await loadCodes();
      setNumberOfCodes(1);
    } catch (error) {
      console.error('Error generating codes:', error);
      alert('Erreur lors de la génération des codes');
    } finally {
      setGenerating(false);
    }
  };

  const generateRandomCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const deleteCode = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce code ?')) return;

    try {
      const { error } = await supabase
        .from('access_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadCodes();
    } catch (error) {
      console.error('Error deleting code:', error);
      alert('Erreur lors de la suppression du code');
    }
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const unusedCodes = codes.filter(c => !c.is_used);
  const usedCodes = codes.filter(c => c.is_used);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Key className="w-8 h-8 text-[#2B7BBE]" />
          <h2 className="text-2xl font-bold text-[#333333]">Codes d'accès</h2>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de codes à générer
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={numberOfCodes}
                onChange={(e) => setNumberOfCodes(parseInt(e.target.value) || 1)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2B7BBE] focus:border-transparent"
              />
            </div>
            <button
              onClick={generateCodes}
              disabled={generating}
              className="flex items-center gap-2 bg-[#5FA84D] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4d8a3f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" />
              {generating ? 'Génération...' : 'Générer des codes'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-[#333333] mb-4">
              Codes disponibles ({unusedCodes.length})
            </h3>
            <div className="space-y-2">
              {unusedCodes.map((code) => (
                <div
                  key={code.id}
                  className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg"
                >
                  <div>
                    <p className="font-mono text-lg font-bold text-green-700">{code.code}</p>
                    {code.notes && (
                      <p className="text-xs text-gray-500 mt-1">{code.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(code.code)}
                      className="p-2 hover:bg-green-100 rounded-lg transition-colors"
                      title="Copier le code"
                    >
                      {copiedCode === code.code ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <Copy className="w-5 h-5 text-green-600" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteCode(code.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
              {unusedCodes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun code disponible. Générez-en de nouveaux.
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#333333] mb-4">
              Codes utilisés ({usedCodes.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {usedCodes.map((code) => (
                <div
                  key={code.id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <p className="font-mono text-lg font-bold text-gray-500 line-through">
                    {code.code}
                  </p>
                  {code.used_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Utilisé le {new Date(code.used_at).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>
              ))}
              {usedCodes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Aucun code utilisé pour le moment.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Important :</strong> Chaque code ne peut être utilisé qu'une seule fois.
            Partagez ces codes uniquement avec les personnes autorisées à créer un compte.
          </p>
        </div>
      </div>
    </div>
  );
}
