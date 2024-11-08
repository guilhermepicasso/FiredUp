import './App.css';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useRef, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import modalidadesData from './API/modalidades.json';
import { alterarFotoEspaco, buscar, criar } from './API/chamadas';
//imports para o checkbox
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

//imports do relogio
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

function App() {

  const [data, setData] = useState(null);
  const [selectedModalidade, setSelectedModalidade] = useState({ id: 'all' });
  const fileInputRef = useRef(null);

  //funcoes das modalidades ja cadastradas
  const [modalidadesCadastradas, setModalidadesCadastradas] = useState([]);
  const [selectedModalidades, setSelectedModalidades] = useState([]);

  const handleChangeModalidades = (event) => {
    const { value, checked } = event.target;

    setSelectedModalidades((prevSelected) => {
      if (checked) {
        // Se estiver marcado, adiciona o ID da modalidade ao array
        return [...prevSelected, value];
      } else {
        // Se desmarcado, remove o ID da modalidade do array
        return prevSelected.filter(idModalidade => idModalidade !== value);
      }
    });
  };

  //referente ao cadastrar modalidade
  const [modalidades] = useState(modalidadesData);
  const handleChange = (event) => {
    setSelectedModalidade({ id: event.target.value });
  };

  //funções referentes ao espaço
  const [espaco, setEspaco] = useState({ nome: "", regras: "", foto: null });
  const handleInputChange = (event) => {
    const { name, value, files, type } = event.target;

    if (type === "file" && files) {
      setEspaco(prevState => ({
        ...prevState,
        foto: files[0],
      }));
    } else {
      setEspaco(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  //função para salvar o espaço
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log(selectedDays);

      const body = {
        "nome": espaco.nome,
        "regras": espaco.regras
      }
      const resp = await criar({ tabela: "espaco", body: body });

      if (resp.status === 200) {
        if (espaco.foto != null) {
          //salva a imagem
          const resp2 = await alterarFotoEspaco(resp.data.id, espaco.foto)
        }

        if (selectedModalidades.length > 0) {
          selectedModalidades.forEach(async modalidade => {
            const body = {
              "idModalidade": modalidade,
              "idEspaco": resp.data.id
            }
            const resp3 = await criar({ tabela: "ModalidadeEspaco", body: body });
          });
        }

        if (selectedDays.length > 0 && horarios.inicio) {
          selectedDays.forEach(async day => {
            const body = {
              "idEspaco": resp.data.id,
              "DiaSemana": day,
              "HoraInicio": horarios.inicio.format('HH:mm'),
              "HoraFim": horarios.fim.format('HH:mm'),
            }
            const resp4 = await criar({ tabela: "DisponibilidadeEspaco", body: body });
            console.log(resp4);
            
          });
        }

        

      }

      setEspaco({ nome: "", regras: "", foto: null });
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Limpa o valor do input file
      }
      setSelectedModalidades([]);
      // toast.success("Novo espaço cadastrado com sucesso!");
    } catch (error) {
      // toast.error("Erro ao cadastrar novo espaço!");
      console.log(error);
    }
  };


  //selecionar o dia da semana
  const days = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab']
  const [selectedDays, setSelectedDays] = useState([]);
  const handleDaysChange = (event, newSelectedDays) => {
    setSelectedDays(newSelectedDays);
  };

  //selecionar hora
  const [horarios, setHorarios] = useState({
    inicio: null,
    fim: null
  });
  const handleTimeChange = (newTime, name) => {
    setHorarios((prevHorarios) => ({
      ...prevHorarios,
      [name]: newTime
    }));
  };


  useEffect(() => {
    const busca = async () => {
      try {
        const modalidades = await buscar("modalidade");
        setModalidadesCadastradas(modalidades);
        console.log(modalidades);

      } catch (error) {
        console.log(error);
      }
    }
    busca();
  }, [])


  return (
    <div className="App">
      <div className='cadastro_modalidade'>
        <p>Cadastrar uma modalidade</p>
        <div className="opcao">
          <label>Lista de modalidade </label>
          <FormControl sx={{ m: 1, minWidth: 200, height: '20px' }}>
            <Select
              value={selectedModalidade.id}
              onChange={handleChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              sx={{ height: '30px' }}
            >
              <MenuItem value="all">
                <em>Todos</em>
              </MenuItem>
              {modalidades.map(modalidade => (
                <MenuItem key={modalidade.id} value={modalidade.id}>{modalidade.modalidade}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className='cadastro_espaco'>
        <p>Cadastre um novo espaço</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Digite o nome do espaço"
            value={espaco.nome}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="regras"
            placeholder="Digite as regras do espaço"
            value={espaco.regras}
            onChange={handleInputChange}
            required
          />
          <input
            type="file"
            name="foto"
            accept="image/*" // Permite apenas imagens (opcional)
            onChange={handleInputChange}
          />

          <p>Inserir modalidade neste espaço</p>
          <div>
            {modalidadesCadastradas.map(modalidade => (
              <FormControlLabel control={
                <Checkbox
                  value={modalidade.idModalidade}
                  onChange={handleChangeModalidades}
                />}
                label={modalidade.Nome}
              />
            ))}
          </div>

          <div>
            <ToggleButtonGroup
              value={selectedDays}
              onChange={handleDaysChange}
              aria-label="days of week"
            >
              {days.map(day => (
                <ToggleButton value={day} aria-label={day}>
                  {day}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </div>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['TimePicker']}>
              <TimePicker
                label="A partir de"
                value={horarios.inicio}
                onChange={(newTime) => handleTimeChange(newTime, 'inicio')}
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
                value={horarios.fim}
                onChange={(newTime) => handleTimeChange(newTime, 'fim')}
                minTime={horarios.inicio}
                viewRenderers={{
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock
                }}
              />
            </DemoContainer>
          </LocalizationProvider>

          {/* falta inserir os itens */}


          <button type="submit">Enviar</button>
        </form>
      </div>

      <p>Adicionar item</p>
      <p>Buscar reservas por data</p>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DemoContainer components={['DatePicker']}>
          <DatePicker
            label="Selecione uma data"
            value={data}
            onChange={(newValue) => setData(newValue)}
            format="DD/MM/YYYY"
          />
        </DemoContainer>
      </LocalizationProvider>
    </div>
  );
}

export default App;
