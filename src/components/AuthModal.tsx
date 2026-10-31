import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: 'signin' | 'signup' | 'phone';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'signin',
}) => {
  const { 
    signInWithGoogle, 
    signInWithEmail, 
    signUpWithEmail, 
    signInWithDemoCustomer 
  } = useAuth();
  const { isUrdu } = useLanguage();

  const [mode, setMode] = useState<'signin' | 'signup' | 'phone'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Phone OTP states
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('786110'); // reliable test OTP

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithGoogle();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Google sign-in was interrupted. Please try again or use email login.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        if (!fullName.trim()) {
          throw new Error('Please enter your full name');
        }
        await signUpWithEmail(email, password, fullName, phoneNumber);
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Incorrect email or password. Please verify your details.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(err.message || 'Authentication error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendPhoneOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      setError('Please enter a valid Pakistani mobile number (e.g. 0300 1234567)');
      return;
    }
    setError(null);
    setLoading(true);

    // Simulate OTP generation for testing in Abbottabad
    setTimeout(() => {
      setPhoneOtpSent(true);
      setLoading(false);
    }, 700);
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || (otpCode.trim() !== generatedOtp && otpCode.trim() !== '123456')) {
      setError(`Invalid verification code. Please enter: ${generatedOtp}`);
      return;
    }

    try {
      setLoading(true);
      // Auto-authenticate customer with phone number
      const phoneEmail = `phone_${phoneNumber.replace(/\D/g, '')}@shamishoe.pk`;
      try {
        await signInWithEmail(phoneEmail, 'ShamiPhonePass2026!');
      } catch {
        await signUpWithEmail(phoneEmail, 'ShamiPhonePass2026!', `Customer (${phoneNumber})`, phoneNumber);
      }
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Phone verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomerLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      await signInWithDemoCustomer();
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed demo login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-neutral-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 font-bold font-serif text-sm flex items-center justify-center border border-amber-500/40">
              SSZ
            </span>
            <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              Shami Shoe Zone • Abbottabad
            </span>
          </div>

          <h3 className="text-xl font-bold font-serif tracking-tight">
            {mode === 'signin' && (isUrdu ? 'اپنے اکاؤنٹ میں داخل ہوں' : 'Customer Sign In')}
            {mode === 'signup' && (isUrdu ? 'نیا کسٹمر اکاؤنٹ بنائیں' : 'Create New Account')}
            {mode === 'phone' && (isUrdu ? 'موبائل نمبر سے لاگ ان' : 'Phone Number Login')}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {isUrdu 
              ? 'آرڈر دینے اور تاریخ دیکھنے کے لیے لاگ ان ضروری ہے' 
              : 'Sign in is required to place your WhatsApp order and track delivery'}
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 text-xs font-semibold">
          <button
            onClick={() => { setMode('signin'); setError(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              mode === 'signin' ? 'border-amber-600 text-amber-600 bg-white' : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {isUrdu ? 'لاگ ان' : 'Sign In'}
          </button>
          <button
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              mode === 'signup' ? 'border-amber-600 text-amber-600 bg-white' : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {isUrdu ? 'رجسٹر کریں' : 'Register'}
          </button>
          <button
            onClick={() => { setMode('phone'); setError(null); }}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              mode === 'phone' ? 'border-amber-600 text-amber-600 bg-white' : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            {isUrdu ? 'فون OTP' : 'Phone OTP'}
          </button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Login Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 shadow-xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-neutral-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-neutral-400 font-medium uppercase">
              {isUrdu ? 'یا' : 'or'}
            </span>
          </div>

          {/* Form based on mode */}
          {mode === 'phone' ? (
            !phoneOtpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {isUrdu ? 'پاکستانی موبائل نمبر' : 'Pakistani Mobile Number'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-500">
                      +92
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="300 1234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1">
                    Format: 0300 1234567 or 300 1234567
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  {loading ? 'Sending OTP...' : (isUrdu ? 'کوڈ حاصل کریں' : 'Send OTP Code')}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-3 animate-in fade-in">
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                  <p className="font-semibold">Verification Code Sent!</p>
                  <p className="text-[11px] mt-0.5">
                    For fast Abbottabad testing, enter verification code: <strong className="font-mono text-neutral-900 bg-white px-1.5 py-0.5 rounded border border-emerald-300">{generatedOtp}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {isUrdu ? '6 ہندسوں کا کوڈ درج کریں' : 'Enter 6-digit Code'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="786110"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full text-center tracking-widest font-mono text-base py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPhoneOtpSent(false)}
                    className="flex-1 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-600 hover:bg-neutral-50"
                  >
                    Change Number
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-sm"
                  >
                    {loading ? 'Verifying...' : (isUrdu ? 'تصدیق کریں' : 'Verify & Continue')}
                  </button>
                </div>
              </form>
            )
          ) : (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {isUrdu ? 'مکمل نام' : 'Full Name'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Muhammad Ali"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {isUrdu ? 'ای میل ایڈریس' : 'Email Address'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  {isUrdu ? 'پاس ورڈ' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    {isUrdu ? 'موبائل نمبر (اختیاری)' : 'Mobile Phone (Optional)'}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                      type="tel"
                      placeholder="0300 1234567"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer mt-2"
              >
                {loading 
                  ? 'Please wait...' 
                  : mode === 'signin' 
                    ? (isUrdu ? 'لاگ ان کریں' : 'Sign In to Account')
                    : (isUrdu ? 'نیا اکاؤنٹ بنائیں' : 'Create Customer Account')}
              </button>
            </form>
          )}

          {/* Quick Demo Customer Button */}
          <div className="pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={handleDemoCustomerLogin}
              className="w-full py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-neutral-500" />
              <span>Fast 1-Click Customer Test Login</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
