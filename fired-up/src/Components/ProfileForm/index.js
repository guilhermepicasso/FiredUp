import './index.scss'
import React, { useState } from 'react';
export function ProfileForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    birthDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    
    <form onSubmit={handleSubmit} className="profile-form">
      <div className="form-grid">
        
        <div>
          <label htmlFor="firstName" className="form-label">
            Nome
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="form-label">
            Sobrenome
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="form-input"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="form-label">
          Telefone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div>
        <label htmlFor="birthDate" className="form-label">
          Data de Nascimento
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          className="form-input"
        />
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="submit-button"
        >
          Salvar 
        </button>
      </div>
    </form>
  );
}
