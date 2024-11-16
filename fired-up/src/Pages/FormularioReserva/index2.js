import "./index.scss";
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs'; // Para manipulação de datas e horas
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useLocation } from "react-router-dom";

export default function FormularioReserva() {
  const location = useLocation();
  const { equipe } = location.state || {};
  const [espaco, setEspaco] = useState('');

  // Estados para data e hora
  const [data, setData] = useState(dayjs()); // Data inicial = hoje
  const [horaInicio, setHoraInicio] = useState(dayjs().add(31, 'minute')); // Hora inicial = agora
  const [horaFim, setHoraFim] = useState(horaInicio.add(30, 'minute')); // Hora final inicial = agora + 1 hora



  // Alterar espaço
  const handleChange = (event) => {
    setEspaco(event.target.value);
  };

  // Atualizar hora final baseada na hora inicial
  const handleHoraInicioChange = (newHoraInicio) => {
    setHoraInicio(newHoraInicio);
    // Atualiza a hora final para garantir que seja válida
    setHoraFim(newHoraInicio.add(30, 'minute')); // Atualiza hora final
  };

  // Implementar a lógica de verificação dos horarios disponiveis de acordo com a tabela HorarioFuncionamento
  // Os dias da semana e horarios devem coincidir
  // Pensar tbm em como combinar esta verificação com a verificação de dias e horarios onde já existem reservas realizadas

  const reservar = (e) => {
    e.preventDefault();

    // Validar campos
    if (!espaco || !data || !horaInicio || !horaFim) {
      toast.info("Por favor, preencha todos os campos");
      return;
    }

    // Lógica de reserva
    console.log({
      espaco,
      data: data.format('YYYY-MM-DD'),
      horaInicio: horaInicio.format('HH:mm'),
      horaFim: horaFim.format('HH:mm'),
      equipe,
    });

    toast.success("Reserva solicitada com sucesso!");
  };

  return (
    <div className="formulario_equipe">
      <div className="formulario_equipe_container">
        <button className="close-button">✖</button>
        <Box
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
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={espaco}
              label="Espaço"
              onChange={handleChange}
              required
            >
              <MenuItem value="Espaço 1">Espaço 1</MenuItem>
              <MenuItem value="Espaço 2">Espaço 2</MenuItem>
              <MenuItem value="Espaço 3">Espaço 3</MenuItem>
            </Select>
          </FormControl>

          {espaco !== '' && (
            <div>
              {/* Selecionar Data */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['DatePicker']}>
                  <DatePicker
                    label="Selecionar Data"
                    value={data}
                    minDate={dayjs()} // A data mínima é hoje
                    onChange={(newValue) => setData(newValue)}
                  />
                </DemoContainer>
              </LocalizationProvider>

              {/* Hora inicial */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker']}>
                  <TimePicker
                    label="Hora inicial"
                    value={horaInicio}
                    minTime={
                      data.isSame(dayjs(), 'day') // Verifica se a data é hoje
                        ? dayjs().add(30, 'minute') // Se for hoje, hora mínima é agora + 30 minutos
                        : null // Se não for hoje, sem restrição
                    }
                    onChange={handleHoraInicioChange}
                  />
                </DemoContainer>
              </LocalizationProvider>

              {/* Hora final */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={['TimePicker']}>
                  <TimePicker
                    label="Hora final"
                    value={horaFim}
                    minTime={horaInicio.add(30, 'minute')} // Hora final mínima = hora inicial + 30 minutos
                    maxTime={horaInicio.add(2, 'hour')} // Hora final máxima = hora inicial + 2 horas
                    onChange={setHoraFim}
                  />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          )}

          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={reservar}>
              Reservar Espaço
            </Button>
          </Stack>
        </Box>
      </div>
    </div>
  );
}
