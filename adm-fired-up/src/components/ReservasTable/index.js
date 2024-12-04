import './index.scss';
import { buscar, alterar, deletar } from '../../API/chamadas';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from "../UserContext/AuthContext.js";
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import { toast } from 'react-toastify';


function ReservasTable(params) {
  const [reservas, setReservas] = useState([]);
  const [espacos, setEspacos] = useState([]);
  const [equipes, setEquipes] = useState([]);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    buscar('Reserva')
      .then((data) => {
        const somentePendentes = location.pathname === '/HomeViewADM';
        const reservasOrdenadas = data
          .filter((res) => (somentePendentes ? !res.status : true)) 
          .sort((a, b) => {
            if (a.status !== b.status) return a.status - b.status;
            return new Date(a.DataReserva) - new Date(b.DataReserva);
          });
        setReservas(reservasOrdenadas);
      })
      .catch((error) => {
        toast.error('Erro ao buscar dados da tabela Reserva:', error);
      });

    buscar('Espaco')
      .then((data) => setEspacos(data))
      .catch((error) => toast.error('Erro ao buscar dados de Espaços', error));

    buscar('Equipe')
      .then((data) => setEquipes(data))
      .catch((error) => toast.error('Erro ao buscar dados de Equipes', error));
  }, [location.pathname]); 

  const handleExcluir = (id) => {
    confirmAlert({
      title: 'Confirmar exclusão',
      message: 'Você tem certeza que deseja excluir esta reserva?',
      buttons: [
        {
          label: 'Sim',
          onClick: () => {
            deletar({ tabela: 'Reserva', id })
              .then(() => {
                toast.success('Reserva excluída com sucesso!');
                setReservas((prevReservas) => prevReservas.filter((res) => res.idReserva !== id));
              })
              .catch((error) => {
                toast.error(`Erro ao excluir a reserva: ${error}`);
              });
          }
        },
        {
          label: 'Não',
          onClick: () => {
            toast.info('Exclusão cancelada');
          }
        }
      ]
    });
  };

  const handleStatus = (id, RA) => {
    const reserva = reservas.find((res) => res.idReserva === id);
  
    if (reserva) {
      const newStatus = reserva.status ? 0 : 1;
      const body = { 
        status: newStatus, 
        idAdmResponsavel: Number(RA)
      }; 
  
      alterar({ tabela: 'Reserva', id, body }) 
        .then(() => {
          toast.success(`Reserva ${newStatus ? 'autorizada' : 'vetada'} com sucesso!`);
          setReservas((prevReservas) => {
            const atualizadas = prevReservas.map((res) =>
              res.idReserva === id ? { ...res, status: newStatus } : res
            );
            return atualizadas.sort((a, b) => {
              if (a.status !== b.status) return a.status - b.status;
              return new Date(a.DataReserva) - new Date(b.DataReserva);
            });
          });
        })
        .catch((error) => {
          toast.error(`Erro ao alterar status da reserva: ${error}`);
        });
    }
  };
  
  const getEspacoNome = (idEspaco) => {
    const espaco = espacos.find((esp) => esp.idEspaco === idEspaco);
    return espaco ? espaco.Nome : 'Espaço desconhecido';
  };

  const getEquipeNome = (idEquipe) => {
    const equipe = equipes.find((eq) => eq.idEquipe === idEquipe);
    return equipe ? equipe.NomeEquipe : 'Individual';
  };

  const getEquipeResponsavel = (idEquipe) =>{
    const equipe = equipes.find((eq)=> eq.idEquipe === idEquipe);
    return equipe ? equipe.idResponsavel:'Invalido';
  }

  return (
    <div className='ComponenteReservaAdm'>
      <p>{user.RA}</p>
      <table className='tabela'>
        <thead className='tabelaHeader'>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Data Reserva</th>
            <th>Hora Início</th>
            <th>Espaço</th>
            <th>Equipe</th>
            <th>RA Responsável</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody className='corpo'>
          {reservas.map((reserva) => (
            <tr key={reserva.idReserva}>
              <td>{reserva.idReserva}</td>
              <td
                style={{
                  backgroundColor: reserva.status ? 'green' : 'var(--amarelo-principal)',
                  color: 'white',
                  textShadow: '1px 1px 2px black',
                  textAlign: 'center',
                }}
              >
                {reserva.status ? 'Autorizado' : 'Pendente'}
              </td>
              <td>{new Date(reserva.DataReserva).toLocaleDateString()}</td>
              <td>{reserva.HoraInicio}</td>
              <td>{getEspacoNome(reserva.idEspaco)}</td>
              <td>{getEquipeNome(reserva.idEquipe)}</td>
              <td>{getEquipeResponsavel(reserva.idEquipe)}</td>
              <td>
                <button className={`botao ${reserva.status ? 'vetar' : 'autorizar'}`} onClick={() => handleStatus(reserva.idReserva, user.RA)}>{reserva.status ? 'Vetar' : 'Autorizar'}</button>
                <button className='botao excluir' onClick={() => handleExcluir(reserva.idReserva)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReservasTable;