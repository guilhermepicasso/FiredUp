import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';


const horariosDisponiveis = [
    { diaSemana: "Segunda", horaInicio: "07:00:00", horaFim: "19:00:00" },
    { diaSemana: "Terça", horaInicio: "07:00:00", horaFim: "19:00:00" },
    { diaSemana: "Quarta", horaInicio: "07:00:00", horaFim: "19:00:00" },
    { diaSemana: "Sexta", horaInicio: "07:00:00", horaFim: "19:00:00" },
    { diaSemana: "Domingo", horaInicio: "12:00:00", horaFim: "15:00:00" },
    { diaSemana: "Domingo", horaInicio: "16:00:00", horaFim: "18:00:00" }
];

// Função para obter os dias da semana disponíveis
const getDiasDisponiveis = () => {
    return [...new Set(horariosDisponiveis.map(item => item.diaSemana))];
};

const App = () => {
    const [data, setData] = useState(null);
    const [horaInicio, setHoraInicio] = useState(null);

    // Função para filtrar os horários de funcionamento para o dia selecionado
    const getHorarioFuncionamento = (dataSelecionada) => {
        const diaSelecionado = dayjs(dataSelecionada).format('dddd');
        return horariosDisponiveis.filter(item => item.diaSemana === diaSelecionado);
    };

    // Função para definir o horário mínimo e máximo baseado no horário de funcionamento
    const getHorarioMaxMin = (dataSelecionada) => {
        const horarios = getHorarioFuncionamento(dataSelecionada);
        if (horarios.length > 0) {
            const horaInicio = dayjs(horarios[0].horaInicio, 'HH:mm:ss');
            const horaFim = dayjs(horarios[0].horaFim, 'HH:mm:ss');
            return { horaInicio, horaFim };
        }
        return { horaInicio: null, horaFim: null };
    };

    // Função para filtrar e desabilitar os dias não disponíveis
    const isDiaPermitido = (date) => {
        const diaSelecionado = dayjs(date).format('dddd');
        return getDiasDisponiveis().includes(diaSelecionado);
    };

    

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* DatePicker - Mostrar apenas os dias disponíveis */}
            <DemoContainer components={['DatePicker']}>
                <DatePicker
                    label="Selecionar Data"
                    value={data}
                    minDate={dayjs()} // A data mínima é hoje
                    onChange={(newValue) => setData(newValue)}
                    shouldDisableDate={(date) => !isDiaPermitido(date)} // Desabilita dias não disponíveis
                />
            </DemoContainer>

            {/* TimePicker - Mostrar horários disponíveis para o dia selecionado */}
            {data && (
                <DemoContainer components={['TimePicker']}>
                    <TimePicker
                        label="Hora inicial"
                        value={horaInicio}
                        onChange={(newValue) => setHoraInicio(newValue)}
                        minTime={getHorarioMaxMin(data).horaInicio} // Hora mínima com base no horário de funcionamento
                        maxTime={getHorarioMaxMin(data).horaFim} // Hora máxima com base no horário de funcionamento
                    />
                </DemoContainer>
            )}
        </LocalizationProvider>
    );
};

export default App;
