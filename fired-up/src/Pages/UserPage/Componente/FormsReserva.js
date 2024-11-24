import Dialog from '@mui/material/Dialog';
import FormularioReserva from '../../FormularioReserva/index2';

export default function FormsReserva(params) {

    return (
        <Dialog
            open={params.open}
            onClose={params.onClose}
        >
            <FormularioReserva equipe={params.equipe} onActionCompleted={params.onActionCompleted} onClose={params.onClose} />
        </Dialog>
    );
}
