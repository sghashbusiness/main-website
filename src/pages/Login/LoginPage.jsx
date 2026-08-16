/**
 * SGHASH UI — LoginPage
 * Full viewport login experience with ambient background and 3D Card Flipper.
 */

import { useState } from 'react';
import LoginCard from './LoginCard';
import PasswordRecoveryCard from './PasswordRecoveryCard';
import './Login.css';

export default function LoginPage() {
  // 'login' or 'recovery'
  const [view, setView] = useState('login');

  return (
    <div className="login-page">
      {/* Animated ambient gradient background */}
      <div className="login-page__ambient-bg anim-ambient-gradient"></div>

      <div className="login-page__content">
        <div className={`card-flipper ${view === 'recovery' ? 'is-flipped' : ''}`}>
          <div className="card-flipper__inner">
            {/* Front side: Login */}
            <div className="card-flipper__front">
              <LoginCard onFlipToRecovery={() => setView('recovery')} />
            </div>

            {/* Back side: Recovery */}
            <div className="card-flipper__back">
              <PasswordRecoveryCard onCancel={() => setView('login')} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="login-page__footer">
        <p>© 2026 SGHASH ONE Retail OS. All rights reserved.</p>
      </div>
    </div>
  );
}
