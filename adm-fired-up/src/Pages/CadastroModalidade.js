import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import modalidadesData from '../API/modalidades.json';
import { useEffect, useState } from 'react';
import { buscar, criar, deletar } from '../API/chamadas';

export default function CadastroModalidade() {
  const [modalidades] = useState(modalidadesData);
  const [selectedModalidade, setSelectedModalidade] = useState({ id: 'all' });
  const [dataModalidade, setDataModalidade] = useState([])


  const handleChange = (event) => {
    setSelectedModalidade({ id: event.target.value });
  };

  const cadastrar = async () => {
    try {
      const body = {
        "Nome": modalidades.filter(modalidade => modalidade.id === selectedModalidade.id)[0]?.modalidade,
        "Foto": modalidades.filter(modalidade => modalidade.id === selectedModalidade.id)[0]?.imagem
      }
      const resp = await criar({tabela: "modalidade", body: body});
      console.log(resp);      
    } catch (error) {
      console.log(error);
    }
  }

  const excluir = async (idModalidade) => {
    try {
      const resp = await deletar({tabela: "modalidade", id: idModalidade});
      console.log(resp);
      
    } catch (error) {
      console.log(error);
      
    }
  }

  useEffect(() => {
    const fetchModalidades = async () => {
      try {
        const modalidades = await buscar("modalidade");
        setDataModalidade(modalidades);
      } catch (error) {
        console.log(error);
      }
    }
    fetchModalidades();
  }, [])

  return (
    <div className='cadastro_modalidade'>
        <p>Cadastrar uma modalidade</p>
      <div className='cadastro'>
        <div className="opcao">
          <label>Selecione uma modalidade para cadastrar </label>
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
        <button onClick={() => cadastrar()}>Cadastrar</button>
      </div>
      <div>Lista das suas modalidades cadastradas</div>
      <div className='lista_modalidade'>
        {dataModalidade.map((modalidade, key) => (
          <div key={key} className='modalidade'>
            <div className='imgModalidade'>
              <img src={modalidade.Foto} alt={`Modalidade ${modalidade.Nome}`} />
            </div>
            <p>{modalidade.Nome}</p>
            <button onClick={() => excluir(modalidade.idModalidade)}>Excluir</button>
          </div>
        ))}
      </div>

    </div>
  )
}