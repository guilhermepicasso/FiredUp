// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { UserContext } from './UserContext';

// export default function ProtectedRoute ({ children }) {
//     const { usuario } = useContext(UserContext);

//     if (!usuario) {
//         return <Navigate to="/Login" />;
//     }

//     return children;
// };