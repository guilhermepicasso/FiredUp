// import { useState } from "react";
// import Box from '@mui/material/Box';
// import TextField from '@mui/material/TextField';
// import IconButton from '@mui/material/IconButton';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import InputAdornment from '@mui/material/InputAdornment';
// import Visibility from '@mui/icons-material/Visibility';
// import VisibilityOff from '@mui/icons-material/VisibilityOff';
// import { buscarUsuario, verificacaoLogin } from "../../API/chamadas";
// import { jwtDecode } from "jwt-decode";
// import { Button, FormControl } from "@mui/material";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export default function App() {
//   const [ra, setRa] = useState('');
//   const [senha, setSenha] = useState('');
//   const [usuario, setUsuario] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [msg, setMsg] = useState("");

//   const handleClickShowPassword = () => setShowPassword((show) => !show);

//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };


//   const handleCampos = (event, campo) => {
//     const valor = event.target.value;
//     if (campo === "ra") {
//       setRa(valor);
//     } else if (campo === "senha") {
//       setSenha(valor);
//     }
//   };



//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     try {
//       const response = await verificacaoLogin({ ra: ra, senha: senha });
//       const { token } = response.data;
//       if (token) {
//         localStorage.setItem('token', token);
//         jwtDecode(token);
//       const info = await buscarUsuario(ra);
//       setUsuario(info.nome);
//       setMsg(usuario)
//       // navigate("/PaginaUsuario");
//       }
//     } catch (error) {
//       toast.error("Usuário ou senha inválido!"+error.message);
//       console.error('Erro ao fazer login', error);
//     }
//   };

//   return (
//     <Box
//       className='formulario'
//       component="form"
//       sx={{
//         '& > :not(style)': { m: 1, width: '35ch' },
//       }}
//       noValidate
//       autoComplete="off"
//       onSubmit={handleSubmit}
//     >
//       <TextField id="outlined-basic" label="RA do aluno" variant="outlined" value={ra} onChange={(e) => handleCampos(e, "ra")} />
//       <FormControl sx={{ m: 1, width: '35ch' }} variant="outlined">
//         <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
//         <OutlinedInput
//           id="outlined-adornment-password"
//           type={showPassword ? 'text' : 'password'}
//           value={senha}
//           onChange={(e) => handleCampos(e, "senha")}
//           endAdornment={
//             <InputAdornment position="end">
//               <IconButton
//                 aria-label="toggle password visibility"
//                 onClick={handleClickShowPassword}
//                 onMouseDown={handleMouseDownPassword}
//                 edge="end"
//               >
//                 {showPassword ? <VisibilityOff /> : <Visibility />}
//               </IconButton>
//             </InputAdornment>
//           }
//           label="Senha"
//         />
//       </FormControl>
//       <Button type="submit" variant="contained" color="primary">
//         Entrar
//       </Button>
//       <p>{msg}</p>
//       <button className='cadastrar' onClick={handleSubmit}>Cadastrar</button>
//       <ToastContainer />
//     </Box>
//   );
// }
