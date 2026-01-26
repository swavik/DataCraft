import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, User, Lock, ArrowRight, Sparkles, Shield, Layers, Phone, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

interface AuthPageProps {
  onLogin: () => void;
}

const AuthPage = ({ onLogin }: AuthPageProps) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentCarousel, setCurrentCarousel] = useState(0);
  const [textVisible, setTextVisible] = useState(false);

  useEffect(() => {
    // Trigger text animations
    setTimeout(() => setTextVisible(true), 100);

    // Carousel auto-rotation
    const interval = setInterval(() => {
      setCurrentCarousel((prev) => (prev + 1) % carouselItems.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const USERS_STORAGE_KEY = 'dataCraft_users';
    const usersData = localStorage.getItem(USERS_STORAGE_KEY);
    let users: Record<string, any> = {};
    try {
      users = usersData ? JSON.parse(usersData) : {};
    } catch (e) {
      users = {};
    }

    // Save user profile if signing up
    if (!isLogin) {
      const userProfile = {
        name: name || 'User',
        email: email,
        phone: phone || 'Not provided',
        joinedDate: new Date().toISOString(),
      };
      
      // If user exists, we might want to preserve their history and other data
      const existingUser = users[email] || {};
      users[email] = {
        ...existingUser,
        profile: userProfile,
        actions: existingUser.actions || [],
        history: existingUser.history || []
      };
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } else {
      // For login, retrieve existing profile or create default
      const existingUser = users[email];
      if (!existingUser) {
        const userProfile = {
          name: 'User',
          email: email,
          phone: 'Not provided',
          joinedDate: new Date().toISOString(),
        };
        users[email] = { profile: userProfile, actions: [], history: [] };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }
    }
    
    localStorage.setItem('dataCraft_currentUserEmail', email);
    window.dispatchEvent(new CustomEvent('user-changed'));
    onLogin();
  };

  const handleGuestContinue = () => {
    const guestEmail = 'guest@example.com';
    localStorage.setItem('dataCraft_currentUserEmail', guestEmail);
    window.dispatchEvent(new CustomEvent('user-changed'));
    onLogin();
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
            <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
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
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-300 ${
                    isLogin 
                      ? 'bg-primary text-primary-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
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
                {!isLogin && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="name" className="text-foreground font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="phone" className="text-foreground font-medium">
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary"
                      />
                    </div>
                  </div>
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
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-base font-semibold group"
                >
                  {isLogin ? 'Login' : 'Sign Up'}
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </form>

              {/* Guest Option */}
              <div className="text-center">
                <button
                  onClick={handleGuestContinue}
                  className="text-primary hover:text-primary/80 font-medium text-sm transition-colors inline-flex items-center gap-1"
                >
                  Continue as Guest
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
