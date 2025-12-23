import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { getSteamLoginUrl, getSteamUser, saveUser, getUser, logout, type SteamUser } from '@/lib/auth';
import { toast } from 'sonner';

interface SteamLoginProps {
  onLogin?: (user: SteamUser) => void;
  onLogout?: () => void;
}

const SteamLogin = ({ onLogin, onLogout }: SteamLoginProps) => {
  const [user, setUser] = useState<SteamUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      
      if (params.has('openid.claimed_id')) {
        try {
          const steamUser = await getSteamUser(params);
          if (steamUser) {
            saveUser(steamUser);
            setUser(steamUser);
            onLogin?.(steamUser);
            toast.success(`Добро пожаловать, ${steamUser.name}!`);
            
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (error) {
          toast.error('Ошибка авторизации через Steam');
        }
      } else {
        const savedUser = getUser();
        if (savedUser) {
          setUser(savedUser);
          onLogin?.(savedUser);
        }
      }
      
      setLoading(false);
    };

    initAuth();
  }, [onLogin]);

  const handleLogin = async () => {
    try {
      const loginUrl = await getSteamLoginUrl();
      window.location.href = loginUrl;
    } catch (error) {
      toast.error('Не удалось получить ссылку для входа');
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    onLogout?.();
    toast.success('Вы вышли из аккаунта');
  };

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="py-12 text-center">
          <div className="animate-pulse text-muted-foreground">Загрузка...</div>
        </CardContent>
      </Card>
    );
  }

  if (user) {
    return (
      <Card className="w-full max-w-md mx-auto border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-xl">{user.name}</CardTitle>
              <CardDescription>Steam ID: {user.steamId}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={() => window.open(user.profileUrl, '_blank')}
            variant="outline"
            className="w-full"
          >
            <Icon name="ExternalLink" size={18} className="mr-2" />
            Открыть профиль Steam
          </Button>
          <Button onClick={handleLogout} variant="destructive" className="w-full">
            <Icon name="LogOut" size={18} className="mr-2" />
            Выйти
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="text-6xl mb-4">🎮</div>
        <CardTitle className="text-2xl">Вход через Steam</CardTitle>
        <CardDescription>
          Авторизуйтесь через Steam, чтобы получить доступ к админ-панели
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleLogin} className="w-full text-lg py-6 glow-primary" size="lg">
          <svg
            className="w-6 h-6 mr-3"
            viewBox="0 0 256 259"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M127.778 0C60.604 0 5.368 52.078 0 118.616l68.476 28.344c5.812-3.968 12.836-6.292 20.412-6.292 1.208 0 2.396.06 3.568.168l30.464-44.132v-.62c0-27.44 22.324-49.764 49.764-49.764 27.44 0 49.764 22.324 49.764 49.764 0 27.436-22.324 49.76-49.764 49.76h-1.148l-43.42 31.032c.084 1.08.14 2.168.14 3.264 0 19.76-16.052 35.812-35.812 35.812-17.64 0-32.364-12.836-35.276-29.764L1.064 162.756C13.272 219.584 64.78 262.736 127.78 262.736c70.752 0 128.22-57.468 128.22-128.22C256 57.768 198.532.004 127.78.004z" />
            <path d="M80.144 194.696l-15.544-6.428c2.744 5.684 7.548 10.42 13.876 12.968 13.688 5.516 29.464-.144 35.248-12.66 2.804-6.06 2.932-12.72.56-18.792-2.372-6.076-7.072-10.992-13.236-13.796-6.124-2.792-12.652-2.948-18.46-1.008l16.06 6.648c10.088 4.164 14.876 15.948 10.712 26.316-4.164 10.368-15.948 15.148-26.316 10.984-.996-.412-1.932-.884-2.9-1.372z" />
            <path d="M210.932 96.068c0-18.284-14.864-33.148-33.148-33.148-18.284 0-33.148 14.864-33.148 33.148 0 18.284 14.864 33.148 33.148 33.148 18.284 0 33.148-14.864 33.148-33.148zm-49.764 0c0-9.164 7.436-16.6 16.6-16.6 9.168 0 16.604 7.436 16.604 16.6 0 9.164-7.436 16.6-16.604 16.6-9.164 0-16.6-7.436-16.6-16.6z" />
          </svg>
          Войти через Steam
        </Button>
      </CardContent>
    </Card>
  );
};

export default SteamLogin;
