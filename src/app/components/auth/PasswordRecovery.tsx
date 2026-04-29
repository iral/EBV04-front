import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { api } from '../../../services/api';
import { Mail, Lock, Terminal, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import type { RecoveryQuestion } from '../../../types/api';

type Step = 'email' | 'questions' | 'newPassword' | 'success';

export default function PasswordRecovery() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [questions, setQuestions] = useState<RecoveryQuestion[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [recoveryToken, setRecoveryToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const questionsData = await api.requestPasswordRecovery({ email });
      setQuestions(questionsData);
      setStep('questions');
      toast.success('Responde las preguntas de seguridad');
    } catch (error) {
      toast.error('Error al procesar la solicitud');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (attemptCount >= 3) {
      toast.error('Demasiados intentos fallidos. Proceso bloqueado por 24 horas.');
      return;
    }

    setIsLoading(true);

    try {
      const answersArray = questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] || '',
      }));

      const response = await api.verifyRecoveryAnswers({
        email,
        answers: answersArray,
      });

      setRecoveryToken(response.recoveryToken);
      setStep('newPassword');
      toast.success('Respuestas correctas. Define tu nueva contraseña');
    } catch (error) {
      setAttemptCount(prev => prev + 1);
      toast.error(`Respuestas incorrectas. Intentos restantes: ${3 - attemptCount - 1}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      await api.resetPassword({ recoveryToken, newPassword });
      setStep('success');
      toast.success('Contraseña actualizada exitosamente');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al actualizar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-lg p-8 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Terminal className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-mono)' }}>
                DevCollab
              </h1>
              <p className="text-xs text-muted-foreground">Recuperación de Contraseña</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-8">
            {['email', 'questions', 'newPassword', 'success'].map((s, index) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${
                    step === s
                      ? 'bg-primary text-primary-foreground'
                      : ['email', 'questions', 'newPassword', 'success'].indexOf(step) > index
                      ? 'bg-primary/30 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {index + 1}
                </div>
                {index < 3 && (
                  <div
                    className={`h-0.5 flex-1 mx-1 transition-colors ${
                      ['email', 'questions', 'newPassword', 'success'].indexOf(step) > index
                        ? 'bg-primary/30'
                        : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Email */}
            {step === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl mb-2">Ingresa tu correo</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Te mostraremos tus preguntas de seguridad
                </p>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-foreground/80">Correo electrónico</label>
                    <div className="relative group">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all group flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>CONTINUAR</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  <div className="text-center pt-4">
                    <Link to="/" className="text-sm text-secondary hover:text-secondary/80 transition-colors flex items-center justify-center gap-2">
                      <ArrowLeft size={16} />
                      Volver al inicio de sesión
                    </Link>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 2: Security Questions */}
            {step === 'questions' && (
              <motion.div
                key="questions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl mb-2">Preguntas de seguridad</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Responde correctamente para continuar
                </p>

                {attemptCount > 0 && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-sm text-destructive">
                      Intentos restantes: {3 - attemptCount}
                    </p>
                  </div>
                )}

                <form onSubmit={handleQuestionsSubmit} className="space-y-4">
                  {questions.map((question) => (
                    <div key={question.id}>
                      <label className="block text-sm mb-2 text-foreground/80">{question.question}</label>
                      <div className="relative group">
                        <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                        <input
                          type="text"
                          value={answers[question.id] || ''}
                          onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                          className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                          placeholder="Tu respuesta"
                          required
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={isLoading || attemptCount >= 3}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all group flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>VERIFICAR</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 3: New Password */}
            {step === 'newPassword' && (
              <motion.div
                key="newPassword"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-xl mb-2">Nueva contraseña</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Crea una contraseña segura para tu cuenta
                </p>

                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 text-foreground/80">Nueva contraseña</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Mínimo 8 caracteres, una letra y un número
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm mb-2 text-foreground/80">Confirmar contraseña</label>
                    <div className="relative group">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all group flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>ACTUALIZAR CONTRASEÑA</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck size={40} className="text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">¡Contraseña actualizada!</h2>
                <p className="text-muted-foreground mb-8">
                  Tu contraseña ha sido actualizada exitosamente.
                  Ahora puedes iniciar sesión con tus nuevas credenciales.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="px-8 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all inline-flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-mono)' }}
                >
                  <span>IR AL LOGIN</span>
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
