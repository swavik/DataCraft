import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, User, Lock, ArrowRight, Sparkles, Shield, Layers, AlertCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import authBg from '@/assets/auth-background.jpg';

const carouselItems = [
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data stays protected with advanced privacy techniques"
  },
  {
    icon: Layers,
    title: "High Quality",
    description: "Generate realistic synthetic data that maintains statistical properties"
  },
  {
    icon: Sparkles,
    title: "AI Powered",
    description: "Leveraging CTGAN technology for superior results"
  }
];

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [currentCarousel, setCurrentCarousel] = useState(0);
  const [textVisible, setTextVisible] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Trigger text animations
    setTimeout(() => setTextVisible(true), 100);

    // Carousel auto-rotation
    const interval = setInterval(() => {
      setCurrentCarousel((prev) => (prev + 1) % carouselItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (!isLogin && (!name.trim() || name.trim().length < 2)) {
      setError('Please enter a valid full name (at least 2 characters)');
      setIsSubmitting(false);
      return;
    }

    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password, name, phoneNumber);

      if (error) {
        // Handle specific Supabase auth errors
        let errorMessage = error.message;
        if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'An account with this email already exists. Try signing in instead.';
        }
        setError(errorMessage);
      } else {
        if (!isLogin) {
          setSuccess('Account created successfully!');
        } else {
          navigate('/home');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${authBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/50 backdrop-blur-[2px]" />
      </div>

      {/* Floating Element */}
      <div className="absolute top-20 left-10 w-16 h-16 rounded-xl bg-primary/20 backdrop-blur-md border border-primary/30 flex items-center justify-center animate-bounce-slow">
        <Database className="w-8 h-8 text-primary" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex w-full">
        {/* Left Side - Info */}
        <div className="hidden lg:flex flex-1 flex-col justify-center px-12 xl:px-20">
          <div className={`space-y-6 transition-all duration-1000 ${textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Database className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-5xl xl:text-6xl font-bold text-foreground leading-tight">
              <span className="gradient-text">DataCraft</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground font-medium">
              Generate Synthetic Data
            </p>

            {/* Description */}
            <p className="text-lg text-muted-foreground/80 max-w-md leading-relaxed">
              Transform your datasets into privacy-safe synthetic data using advanced CTGAN technology
            </p>

            {/* CTA Text */}
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Sparkles className="w-5 h-5" />
              <span>Start Generating right now</span>
            </div>

            {/* Carousel */}
            <div className="pt-8 space-y-4">
              <div className="flex gap-2">
                {carouselItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCarousel(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentCarousel 
                        ? 'w-8 bg-primary' 
                        : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                  />
                ))}
              </div>

              <div className="relative h-24 overflow-hidden">
                {carouselItems.map((item, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 flex items-start gap-4 transition-all duration-500 ${
                      index === currentCarousel 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 translate-x-8'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Box */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-12">
          <div 
            className={`w-full max-w-md transition-all duration-700 delay-300 ${
              textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Glass Card */}
            <div className="backdrop-blur-xl bg-card/80 border border-border/50 rounded-2xl shadow-2xl p-8 space-y-6">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-6">
                <h1 className="text-3xl font-bold gradient-text">DataCraft</h1>
                <p className="text-sm text-muted-foreground mt-1">Generate Synthetic Data</p>
              </div>

              {/* Toggle Buttons */}
              <div className="flex rounded-xl bg-muted/50 p-1">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setSuccess('');
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                    isLogin 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setSuccess('');
                    setName('');
                    setPhoneNumber('');
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="border-green-500 bg-green-50 text-green-800">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <>
                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="name" className="text-foreground font-medium">
                        Full Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 animate-fade-in">
                      <Label htmlFor="phoneNumber" className="text-foreground font-medium">
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phoneNumber"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                    />
                  </div>
                </div>

                {!isLogin && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="confirmPassword" className="text-foreground font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={isSubmitting || loading}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-base font-semibold group"
                >
                  {isSubmitting ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                  {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;