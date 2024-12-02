
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import { deletar } from '../../../API/chamadas';

export default function AlertDialog(params) {

  const deletarDados = async () => {
    try {
      if (params.button === "Sair da Equipe") {
        console.log("Tentando sair da equipe", params.id);

        await deletar(`Participante/${params.id}`);
        toast.success("Você saiu da equipe!");

      } else if (params.button === "Deletar Equipe") {
        console.log("Tentando deletar a equipe", params.id);
        await deletar(`Equipe/${params.id}`);
        toast.success("Equipe deletada com sucesso!");
      } else {
        console.log("Tentando excluir reserva", params.id);
        await deletar(`Reserva/${params.id}`);
        toast.success("Reserva cancelada com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao tentar executar ação!");
      console.log(error);

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
        {params.button === "Sair da Equipe" ?
          "Deseja realmente sair desta equipe?" :
          params.button === "Deletar Equipe" ?
            "Deseja realmente deletar esta equipe?" :
            "Deseja realmente excluir esta reserva?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {params.button === "Sair da Equipe" ?
            "Após confirmar você será retirado da equipe e talvez não consiga mais voltar por falta de vaga." :
            "Esta ação não poderá ser revertida e todos os dados serão perdidos."}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => params.onClose()} >Cancelar</Button>
        <Button onClick={() => (deletarDados())} autoFocus>
          {params.button}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
