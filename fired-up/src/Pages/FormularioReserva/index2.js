import "./index.scss";
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { buscar, create, edit } from "../../API/chamadas";


// Estado inicial
const diasDaSemana = {
  "Domingo": 0,
  "Segunda": 1,
  "Terça": 2,
  "Quarta": 3,
  "Quinta": 4,
  "Sexta": 5,
  "Sábado": 6
};

export default function FormularioReserva(params) {
  const [editar, setEditar] = useState(false);
  const [espacoSelecionado, setEspacoSelecionado] = useState('');
  const [espacos, setEspacos] = useState([]);

  // Estados para data e hora
  const [horarioFuncionamento, setHorarioFuncionamento] = useState([]); // Lista de horários de funcionamento
  const [data, setData] = useState(dayjs()); // Data inicial = hoje
  const [horaInicio, setHoraInicio] = useState(dayjs().add(31, 'minute')); // Hora inicial = agora
  // const [horaFim, setHoraFim] = useState(horaInicio.add(30, 'minute')); // Hora final inicial = agora + 1 hora

  const [reservas, setReservas] = useState([]); // Lista de reservas existentes

  // Alterar espaço
  const handleChange = (event) => {
    setEspacoSelecionado(event.target.value);
  };

  const reservar = async (e) => {
    e.preventDefault();
    // Validar campos
    if (!espacoSelecionado || !data || !horaInicio || !params.equipe) {
      toast.info("Por favor, preencha todos os campos");
      return;
    }

    try {
      let resp = {}
      if (editar) {
        const body = {
          "DataReserva": data.format('YYYY-MM-DD'),
          "HoraInicio": horaInicio.format('HH:mm'),
          "HoraFim": horaInicio.add(60, 'minute').format('HH:mm'),
          "idEspaco": espacoSelecionado,
          "status": false
        }
        resp = await edit(`Reserva/${params.reserva.idReserva}`, body);
      } else {
        const body = {
          "DataReserva": data.format('YYYY-MM-DD'),
          "HoraInicio": horaInicio.format('HH:mm'),
          "HoraFim": horaInicio.add(60, 'minute').format('HH:mm'),
          "idEspaco": espacoSelecionado,
          "idEquipe": params.equipe.idEquipe,
          "status": false
        }
        resp = await create("Reserva", body);
      }
      if (resp.status === 200) {
        toast.success("Reserva solicitada com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao tentar realizar reserva!");
    }
    params.onClose();
    params.onActionCompleted();
  };


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       console.log(params.modalidade);

  //       // Fazendo a requisição para buscar os espaços
  //       const espacos = await buscar(`ModalidadeEspaco/idModalidade/${params.modalidade}`);

  //       // Verifique se espacos é um array antes de tentar usar .map
  //       if (Array.isArray(espacos)) {
  //         // Use uma Promise.all para buscar as informações dos espaços de forma assíncrona
  //         const infoEspacos = await Promise.all(
  //           espacos.map(async (espaco) => {
  //             const data = await buscar(`espac/idEspaco/${espaco.idEspaco}`);
  //             console.log("dados do espaço", data);
  //             return data;
  //           })
  //         );

  //         // Verifica se não há espaços
  //         if (infoEspacos.length === 0) {
  //           toast.warning("Não há espaços disponíveis para esta modalidade.");
  //         } else {
  //           // Caso contrário, atualiza o estado com os espaços encontrados
  //           setEspacos(infoEspacos);
  //         }
  //       } else {
  //         console.log("A resposta de espaços não é um array:", espacos);
  //       }
  //     } catch (error) {
  //       console.log("Erro ao buscar a lista de espaços:", error);
  //       toast.error("Erro ao buscar espaços.");
  //     }
  //   };








  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await buscar('espaco')
        setEspacos(data);
      } catch (error) {
        console.log("Erro ao buscar a lista de espaços");
      }
    }
    if (params.reserva) {
      setEspacoSelecionado(params.reserva.idEspaco);
      const horaReserva = dayjs(params.reserva.HoraInicio, 'HH:mm:ss')
      setHoraInicio(horaReserva);
      const date = dayjs(params.reserva.DataReserva);
      setData(date);
    }
    fetchData();
  }, [])

  useEffect(() => {
    const buscarDadosDeHorarios = async () => {
      try {
        const horarios = await buscar(`HorarioFuncionamento/idEspaco/${espacoSelecionado}`)
        setHorarioFuncionamento(horarios)
      } catch (error) {
        if (error.status === 404) {
          setHorarioFuncionamento([])
        } else {
          toast.error("Erro ao buscar os horários de funcionamento do espaço!")
        }
      }

      try {
        const reservas = await buscar(`Reserva/idEspaco/${espacoSelecionado}`)
        setReservas(reservas)

      } catch (error) {
        if (error.status !== 404) {

          toast.error("Erro ao buscar os reservas do espaço!")
        }
      }
    }
    if (espacoSelecionado !== '') {
      buscarDadosDeHorarios()
    }

  }, [espacoSelecionado])

  // Função para determinar se uma data é permitida com base nos horários de funcionamento e reservas
  const isDiaPermitido = (date) => {
    const diaSemana = date.day();
    const horarioDisponivel = horarioFuncionamento.some(horario => diasDaSemana[horario.diaSemana] === diaSemana);
    return horarioDisponivel;
  };

  // Função para determinar o horário de funcionamento para o dia selecionado
  const getHorarioFuncionamento = (dataSelecionada) => {
    const diaSemana = dataSelecionada.day(); // Obtém o dia da semana
    return horarioFuncionamento.find(horario => diasDaSemana[horario.diaSemana] === diaSemana);
  };

  // Manipulador para a mudança do horário de início
  const handleHoraInicioChange = (newHoraInicio) => {
    const horarioFuncionamento = getHorarioFuncionamento(data);

    if (horarioFuncionamento) {
      const inicio = dayjs(horarioFuncionamento.horaInicio, 'HH:mm:ss');
      const fim = dayjs(horarioFuncionamento.horaFim, 'HH:mm:ss');

      // Verifica se o horário selecionado está dentro do horário de funcionamento
      if (newHoraInicio.isBetween(inicio, fim, null, '[)')) {
        setHoraInicio(newHoraInicio);
      }
    }
  };

  // // Manipulador para a mudança do horário de fim
  // const handleHoraFimChange = (newHoraFim) => {
  //   const horarioFuncionamento = getHorarioFuncionamento(data);

  //   if (horarioFuncionamento) {
  //     const inicio = dayjs(horarioFuncionamento.horaInicio, 'HH:mm:ss');
  //     const fim = dayjs(horarioFuncionamento.horaFim, 'HH:mm:ss');

  //     // Verifica se o horário selecionado está dentro do horário de funcionamento
  //     if (
  //       newHoraFim.isBetween(inicio, fim, null, '[)')
  //     ) {
  //       setHoraFim(newHoraFim);
  //     }
  //   }
  // };

  const formatarReserva = (reserva) => {
    const dataReserva = new Date(reserva.DataReserva);
    const horaInicio = new Date(dataReserva.toISOString().split('T')[0] + 'T' + reserva.HoraInicio);
    const horaFim = new Date(dataReserva.toISOString().split('T')[0] + 'T' + reserva.HoraFim);

    return {
      horaInicio: horaInicio.toISOString(),
      horaFim: horaFim.toISOString()
    };
  }

  const isHorarioReservado = (dataSelecionada, hora) => {

    const horario = dayjs(dataSelecionada).hour(hora.hour()).minute(hora.minute());

    const reservasNaData = reservas.filter(reserva => reserva.DataReserva.split('T')[0] === dataSelecionada.format('YYYY-MM-DD'));
    const reservasformatadas = [];
    reservasNaData.forEach(reserva => {
      const format = formatarReserva(reserva);
      reservasformatadas.push(format);
    })
    // Verificar se o horário cai dentro de qualquer intervalo reservado
    return reservasformatadas.some((reserva) => {
      const horaInicio = dayjs(reserva.horaInicio);

      const horaFim = dayjs(reserva.horaFim);

      return horario.isAfter(horaInicio) && horario.isBefore(horaFim);
    });
  }

  return (
    <Box
      className="formulario_equipe_container"
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
      onSubmit={reservar}
    >
      <h1>Solicitar Reserva</h1>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label" required>Espaço</InputLabel>
        <Select
          disabled={!editar && params.reserva}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={espacoSelecionado}
          label="Espaço"
          onChange={handleChange}
          required
        >
          {espacos.map((espaco, key) => (
            <MenuItem key={key} value={espaco.idEspaco}>{espaco.Nome}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {espacoSelecionado !== '' && (
        <div>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* Selecionar Data */}
            <DemoContainer components={['DatePicker']}>
              <DatePicker
                disabled={params.reserva && !editar}
                label="Selecionar Data"
                value={data}
                minDate={dayjs()} // A data mínima é hoje
                onChange={(newValue) => setData(newValue)}
                shouldDisableDate={(date) => !isDiaPermitido(date)} // Desativa dias não permitidos ou reservados
              />
            </DemoContainer>

            {/* Hora inicial */}
            <DemoContainer components={['TimePicker']}>
              <TimePicker
                disabled={params.reserva && !editar}
                label="Hora inicial"
                value={horaInicio}
                minTime={getHorarioFuncionamento(data) ? dayjs(getHorarioFuncionamento(data).horaInicio, 'HH:mm:ss') : null}
                maxTime={getHorarioFuncionamento(data) ? dayjs(getHorarioFuncionamento(data).horaFim, 'HH:mm:ss') : null}
                onChange={handleHoraInicioChange}
                shouldDisableTime={(time) => isHorarioReservado(data, dayjs(time, 'HH:mm'))}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                }}
              />
            </DemoContainer>

            {/* Hora final */}
            {/* <DemoContainer components={['TimePicker']}>
                  <TimePicker
                    label="Hora final"
                    value={horaFim}
                    minTime={horaInicio ? horaInicio.add(30, 'minute') : null} // Hora final mínima = hora inicial + 30 minutos
                    maxTime={horaInicio ? horaInicio.add(2, 'hour') : null} // Hora final máxima = hora inicial + 2 horas
                    onChange={handleHoraFimChange}
                    shouldDisableTime={(time) => isHorarioReservado(data, dayjs(time, 'HH:mm'))}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                      seconds: renderTimeViewClock,
                    }}
                  />
                </DemoContainer> */}
          </LocalizationProvider>
        </div>
      )}

      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={(e) => (params.reserva && !editar ? setEditar(true) : reservar(e))}>
          {params.reserva && !editar ? 'Alterar Reserva' : "Reservar Espaço"}
        </Button>
      </Stack>
    </Box>
  );
}
