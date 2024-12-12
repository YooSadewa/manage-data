'use client';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center font-[800]">LOGIN</h1>
        <img src="/assets/logo.png" alt="" width={'200px'} className='m-auto'/>
        <LoginForm />
      </div>
    </div>
  );
}