
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import { deletar } from '../../../API/chamadas';

export default function AlertDialog(params) {

  const deletarEquipe = async () => {
    try {
      await deletar(`equipe/${params.id}`);
      toast.success("Deletou a equipe");
    } catch (error) {
      toast.error("Erro ao tentar deletar equipe");
    }
    params.onClose();
    params.onActionCompleted();
  }

  const sairDaEquipe = async () => {
    try {
      await deletar(`participante/${params.id}`);
      toast.success("Saiu da equipe");
    } catch (error) {
      toast.error("Erro ao tentar deletar equipe");      
    }
    params.onClose();
    params.onActionCompleted();
  }

  return (
    <Dialog
      open={params.open}
      onClose={params.onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {params.button === "Sair da Equipe" ? "Deseja realmente sair desta equipe?" : "Deseja realmente excluir esta equipe?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {params.button === "Sair da Equipe" ?
            "Após confirmar você será retirado da equipe e talvez não consiga mais voltar por falta de vaga." :
            "Esta ação não poderá ser revertida e todos os dados serão perdidos."}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={params.onClose}>Cancelar</Button>
        <Button onClick={() => (params.button === "Sair da Equipe" ? sairDaEquipe() : deletarEquipe())} autoFocus>
          {params.button}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
