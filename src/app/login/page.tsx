import { LoginForm } from '@/components/auth/LoginForm'
import './login.css'

export const metadata = {
  title: 'Login - IN-WAVE Dashboard',
  description: 'Admin login for IN-WAVE Architects dashboard',
}

export default function LoginPage() {
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>IN-WAVE Dashboard</h1>
          <p>Sign in to manage your website content</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
