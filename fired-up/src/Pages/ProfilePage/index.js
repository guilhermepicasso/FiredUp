import './index.scss'
import React from 'react';

import { ProfileForm } from '../../Components/ProfileForm/index';

function ProfilePage() {
  return (
    <div className="profile-page">
        <img className='logoP' src='/Assets/images/logoFired.png' alt='Logo da FiredUp' />
      <main className="profile-main">
        <div className="profile-container profile-container-sm">
          <h1 className="profile-heading">Informações Pessoais</h1>
          <ProfileForm />
        </div>
      </main>
    </div>
  );
}

export default ProfilePage;
