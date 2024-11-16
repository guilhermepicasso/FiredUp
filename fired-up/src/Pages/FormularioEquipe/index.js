import "./index.scss"
import React, { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { create } from "../../API/chamadas";


import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';



export default function FormularioEquipe() {
  const [nomeEquipe, setNomeEquipe] = useState('');
  const [qtdParticipantes, setQtdParticipantes] = useState(1);
  const [modalidade, setModalidade] = useState("");
  const location = useLocation();
  const { modalidades = [], user } = location.state || {};
  const [privacidade, setPrivacidade] = useState(false);
  const navigate = useNavigate();

  const label = { inputProps: { 'aria-label': 'Switch demo' } };

  const closed = () => {
    navigate(-1);
  }

  const handleToggle = () => {
    setPrivacidade((prev) => !prev);
  };

  const handleForms = async (e) => {
    e.preventDefault();
    if (!modalidade) {
      toast.warning("Necessário selecionar uma modalidade")
      return;
    }
    const body = {
      "NomeEquipe": nomeEquipe,
      "isPublica": privacidade,
      "idResponsavel": user.RA,
      "QtdMaxima": qtdParticipantes,
      "idModalidade": modalidade.idModalidade
    }
    try {
      const resp = await create('equipe', body)
      if (resp.status === 200) {
        toast.success("Equipe criada com sucesso!");
        navigate(-1);
      }

    } catch (error) {
      toast.error("Erro ao tentar criar equipe!");
    }
  }


  return (
    <div className="formulario_equipe">
      <div className="formulario_equipe_container">
        <button className="close-button" onClick={() => { closed() }}>✖</button>
        <Box
          component="form"
          sx={{ '& > :not(style)': { m: 1, width: '100%' } }}
          noValidate
          autoComplete="off"
          onSubmit={handleForms}
        >
          <h1>Nova Equipe</h1>
          <TextField
            label="Nome da Equipe"
            variant="outlined"
            value={nomeEquipe}
            onChange={(e) => setNomeEquipe(e.target.value)}
            required
          />
          <div className="text_field">
            <TextField fullWidth
              type="number"
              inputProps={{ min: 1 }}
              label="Qtd. de participantes"
              variant="outlined"
              value={qtdParticipantes}
              onChange={(e) => { setQtdParticipantes(e.target.value); }}
              required
            />
                <FormControl fullWidth>
                  <InputLabel>Modalidade</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    value={modalidade || {}}
                    label="Modalidade"
                    onChange={(event) => setModalidade(event.target.value)}
                  >
                    {modalidades.map(modalidade => (
                      <MenuItem key={modalidade.idModalidade} value={modalidade}>{modalidade.Nome}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
          </div>

          <p>Tornar equipe privada
            <Switch
              {...label}
              checked={privacidade}
              onChange={handleToggle}
            />
          </p>

          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained">
              Criar Equipe
            </Button>
          </Stack>
        </Box>
      </div>

    </div>
  );
}

