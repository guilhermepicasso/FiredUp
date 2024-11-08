// import React, { createContext, useState, useEffect } from 'react';
// import { jwtDecode } from "jwt-decode";
// import { buscarEquipesQueParticipo, sairDoTime, salvar } from '../../API/chamadas';

// export const UserContext = createContext();

// export const UserProvider = ({ children }) => {
//     const [usuario, setUsuario] = useState(null);
//     const [equipesParticipo, setEquipesParticipo] = useState([]);

//     const logout = () => {
//         localStorage.removeItem('token');
//         setUsuario(null);
//     };

//     const listaEquipesQueParticipo = async (id_usuario) => {
//         const info = await buscarEquipesQueParticipo(id_usuario);
//         setEquipesParticipo(info);
//     }

//     // const sair = async (link, time) => {
//     //     const resp = await sairDoTime(link, time);
//     //     await listaTimes(usuario.id)
//     //     return resp;
//     // }

//     const entrarProTime = async (id_equipe, id_usuario) => {
//         const body = {
//             idUsuario: id_usuario,
//             idEquipe: id_equipe,
//             DataEntrada: Date.now(),
//         };
//         const resp = await entrarProTime(body);
//         return resp;
//     };

//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         let decoded = '';
//         if (token) {
//             decoded = jwtDecode(token);
//         }
//         const buscar = async () => {
//             try {
//                 const info = await buscarUsuario(decoded.infoUsuario[0].id)
//                 setUsuario(info[0]);
//                 await listaEquipesQueParticipo(decoded.infoUsuario[0].id);
//             } catch (error) {
//                 console.log(error);
//             }
//         }
//         buscar();
//     }, []);

//     return (
//         <UserContext.Provider value={{ usuario, setUsuario, logout, equipesParticipo, entrarProTime }}>
//             {children}
//         </UserContext.Provider>
//     );
// };