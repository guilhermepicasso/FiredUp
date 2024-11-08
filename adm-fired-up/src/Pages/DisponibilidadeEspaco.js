import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useState } from 'react';
import { criar } from '../API/chamadas';

export default function DisponibilidadeEspaco(params) {
    const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
    const [selectedDays, setSelectedDays] = useState([]);
    const [horarios, setHorarios] = useState({
        manha: { inicio: null, fim: null },
        tarde: { inicio: null, fim: null },
        noite: { inicio: null, fim: null },
    });

    const handleDaysChange = (event, newSelectedDays) => {
        setSelectedDays(newSelectedDays);
    };


    const handleTimeChange = (newTime, periodo, type) => {
        setHorarios((prevHorarios) => ({
            ...prevHorarios,
            [periodo]: {
                ...prevHorarios[periodo],
                [type]: newTime,
            },
        }));
    };

    const salvarDisponibinidade = async () => {
        if (selectedDays.length > 0 && horarios.inicio) {
            for (const day of selectedDays) {
                for (const periodo of Object.keys(horarios)) {
                    const body = {
                        idEspaco: params.idEspaco,
                        DiaSemana: day,
                        HoraInicio: horarios[periodo].inicio.format('HH:mm'),
                        HoraFim: horarios[periodo].fim.format('HH:mm'),
                    };

                    try {
                        const resp4 = await criar({ tabela: "DisponibilidadeEspaco", body });
                        console.log(resp4);
                    } catch (error) {
                        console.error(`Erro ao salvar disponibilidade para o dia ${day}, período ${periodo}:`, error);
                    }
                }
            }
        }
    }

    return (
        <div>
            <ToggleButtonGroup
                orientation="vertical"
                value={selectedDays}
                onChange={handleDaysChange}
                aria-label="days of week"
            >
                {days.map(day => (
                    <div style={{ display: "flex" }}>
                        <ToggleButton value={day} aria-label={day}>
                            {day}
                        </ToggleButton>
                        {Object.keys(horarios).map((periodo, index) => (
                            <div key={index} className='periodo'>
                                <p>{periodo.charAt(0).toUpperCase() + periodo.slice(1)}</p>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']}>
                                        <TimePicker
                                            label="A partir de"
                                            value={horarios[periodo].inicio}
                                            onChange={(newTime) => handleTimeChange(newTime, periodo, 'inicio')}
                                            viewRenderers={{
                                                hours: renderTimeViewClock,
                                                minutes: renderTimeViewClock
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={['TimePicker']}>
                                        <TimePicker
                                            label="Até"
                                            name='Fim'
                                            value={horarios[periodo].fim}
                                            onChange={(newTime) => handleTimeChange(newTime, periodo, 'fim')}
                                            minTime={horarios[periodo].inicio}
                                            viewRenderers={{
                                                hours: renderTimeViewClock,
                                                minutes: renderTimeViewClock
                                            }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </div>
                        ))}
                    </div>
                ))}
            </ToggleButtonGroup>
        </div>
    )
}