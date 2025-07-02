import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useHealth } from '@/contexts/HealthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';


const DeleteAccountSection = () => {

  const { user } = useHealth();
  const [code, setCode] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const handleDelete = async () => {
    if (!code || !user) {
      toast.error("Veuillez entrer le code de confirmation.");
      return;
    }

    setIsDeleting(true);
    try {
        const userId = localStorage.getItem('user_id');
      if (!userId) {
        toast.error("Utilisateur non trouvé.");
        setIsDeleting(false);
        return;
      }
      const res = await fetch('http://localhost/pfe/backend/controllers/deleteMyCompet.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success("Compte supprimé avec succès.");
        localStorage.clear();
        navigate('/login');
      } else {
        toast.error(result.message || "Erreur lors de la suppression.");
      }
    } catch (err) {
      toast.error("Erreur de connexion.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h3 className="font-medium">Supprimer le compte</h3>
        <p className="text-sm text-muted-foreground">
          Supprimez définitivement votre compte et toutes les données associées.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Input
          type="password"
          placeholder="Mot de passe"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button
          variant="destructive"
            className="mt-2 md:mt-0"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          Supprimer
        </Button>
      </div>
    </div>
  );
};

export default DeleteAccountSection;
