import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLogin: () => void;
}

const ADMIN_LOGIN = '2o_off';
const ADMIN_PASSWORD = 'Gosha2012';

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
        localStorage.setItem('adminAuth', 'true');
        toast.success('Вход выполнен успешно!');
        onLogin();
      } else {
        toast.error('Неверный логин или пароль');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="text-6xl mb-4">🔐</div>
        <CardTitle className="text-2xl">Вход в админ-панель</CardTitle>
        <CardDescription>
          Введите логин и пароль для доступа
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login">Логин</Label>
            <Input
              id="login"
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите логин"
              required
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              required
              autoComplete="current-password"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-lg py-6 glow-primary"
            size="lg"
          >
            {loading ? (
              <>
                <Icon name="Loader2" className="mr-2 animate-spin" size={20} />
                Вход...
              </>
            ) : (
              <>
                <Icon name="LogIn" className="mr-2" size={20} />
                Войти
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminLogin;
