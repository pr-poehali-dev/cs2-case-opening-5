import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';
import AdminLogin from '@/components/AdminLogin';

type Rarity = 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common';

interface CaseType {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

interface Item {
  id: number;
  name: string;
  rarity: Rarity;
  image: string;
  price: number;
  caseId: number;
}

const rarityColors: Record<Rarity, string> = {
  legendary: 'bg-legendary text-white',
  epic: 'bg-epic text-white',
  rare: 'bg-rare text-white',
  uncommon: 'bg-uncommon text-white',
  common: 'bg-common text-white',
};

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    setIsAuthenticated(authStatus === 'true');
  }, []);

  const [cases, setCases] = useState<CaseType[]>([
    { id: 1, name: 'Стартовый кейс', price: 100, image: '🎁', description: 'Идеально для новичков' },
    { id: 2, name: 'Золотой кейс', price: 500, image: '💎', description: 'Повышенный шанс редких скинов' },
    { id: 3, name: 'Легендарный кейс', price: 1000, image: '👑', description: 'Эксклюзивные легендарные скины' },
  ]);

  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'AK-47 | Огненный змей', rarity: 'legendary', image: '🔥', price: 2500, caseId: 3 },
    { id: 2, name: 'AWP | Азимов', rarity: 'epic', image: '⚡', price: 1200, caseId: 2 },
    { id: 3, name: 'M4A4 | Неон', rarity: 'rare', image: '🌟', price: 500, caseId: 1 },
    { id: 4, name: 'Desert Eagle | Пламя', rarity: 'epic', image: '💥', price: 800, caseId: 2 },
    { id: 5, name: 'Glock-18 | Градиент', rarity: 'uncommon', image: '🎨', price: 200, caseId: 1 },
    { id: 6, name: 'USP-S | Затмение', rarity: 'rare', image: '🌙', price: 450, caseId: 2 },
    { id: 7, name: 'Нож-бабочка | Убийство', rarity: 'legendary', image: '🦋', price: 3000, caseId: 3 },
    { id: 8, name: 'P90 | Азиимов', rarity: 'uncommon', image: '💫', price: 150, caseId: 1 },
  ]);

  const [editingCase, setEditingCase] = useState<CaseType | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [caseDialogOpen, setCaseDialogOpen] = useState(false);
  const [itemDialogOpen, setItemDialogOpen] = useState(false);

  const [caseForm, setCaseForm] = useState({ name: '', price: 0, image: '', description: '' });
  const [itemForm, setItemForm] = useState({ name: '', rarity: 'common' as Rarity, image: '', price: 0, caseId: 1 });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'case' | 'item') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'case') {
          setCaseForm({ ...caseForm, image: result });
        } else {
          setItemForm({ ...itemForm, image: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveCase = () => {
    if (editingCase) {
      setCases(cases.map(c => c.id === editingCase.id ? { ...editingCase, ...caseForm } : c));
      toast.success('Кейс обновлен!');
    } else {
      const newCase = { id: Date.now(), ...caseForm };
      setCases([...cases, newCase]);
      toast.success('Кейс создан!');
    }
    setCaseDialogOpen(false);
    setEditingCase(null);
    setCaseForm({ name: '', price: 0, image: '', description: '' });
  };

  const deleteCase = (id: number) => {
    setCases(cases.filter(c => c.id !== id));
    setItems(items.filter(i => i.caseId !== id));
    toast.success('Кейс удален!');
  };

  const saveItem = () => {
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...editingItem, ...itemForm } : i));
      toast.success('Скин обновлен!');
    } else {
      const newItem = { id: Date.now(), ...itemForm };
      setItems([...items, newItem]);
      toast.success('Скин добавлен!');
    }
    setItemDialogOpen(false);
    setEditingItem(null);
    setItemForm({ name: '', rarity: 'common', image: '', price: 0, caseId: 1 });
  };

  const deleteItem = (id: number) => {
    setItems(items.filter(i => i.id !== id));
    toast.success('Скин удален!');
  };

  const openEditCase = (caseItem: CaseType) => {
    setEditingCase(caseItem);
    setCaseForm({ name: caseItem.name, price: caseItem.price, image: caseItem.image, description: caseItem.description });
    setCaseDialogOpen(true);
  };

  const openEditItem = (item: Item) => {
    setEditingItem(item);
    setItemForm({ name: item.name, rarity: item.rarity, image: item.image, price: item.price, caseId: item.caseId });
    setItemDialogOpen(true);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    toast.success('Вы вышли из системы');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <AdminLogin onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">⚙️</div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Админ-панель
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleLogout}>
                <Icon name="LogOut" size={20} className="mr-2" />
                Выйти
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                <Icon name="Home" size={20} className="mr-2" />
                На главную
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Управление кейсами</h2>
            <Dialog open={caseDialogOpen} onOpenChange={setCaseDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingCase(null); setCaseForm({ name: '', price: 0, image: '', description: '' }); }} className="glow-primary">
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить кейс
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingCase ? 'Редактировать кейс' : 'Создать кейс'}</DialogTitle>
                  <DialogDescription>
                    Заполните информацию о кейсе и загрузите изображение
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="case-name">Название</Label>
                    <Input
                      id="case-name"
                      value={caseForm.name}
                      onChange={(e) => setCaseForm({ ...caseForm, name: e.target.value })}
                      placeholder="Название кейса"
                    />
                  </div>
                  <div>
                    <Label htmlFor="case-price">Цена (₽)</Label>
                    <Input
                      id="case-price"
                      type="number"
                      value={caseForm.price}
                      onChange={(e) => setCaseForm({ ...caseForm, price: Number(e.target.value) })}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="case-description">Описание</Label>
                    <Textarea
                      id="case-description"
                      value={caseForm.description}
                      onChange={(e) => setCaseForm({ ...caseForm, description: e.target.value })}
                      placeholder="Описание кейса"
                    />
                  </div>
                  <div>
                    <Label htmlFor="case-image">Изображение</Label>
                    <Input
                      id="case-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'case')}
                    />
                    {caseForm.image && (
                      <div className="mt-2">
                        <img src={caseForm.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                  <Button onClick={saveCase} className="w-full" disabled={!caseForm.name || !caseForm.image}>
                    {editingCase ? 'Сохранить изменения' : 'Создать кейс'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((caseItem) => (
              <Card key={caseItem.id} className="group hover:border-primary/50 transition-all">
                <CardHeader>
                  {caseItem.image.startsWith('data:') ? (
                    <img src={caseItem.image} alt={caseItem.name} className="w-full h-48 object-cover rounded-lg mb-4" />
                  ) : (
                    <div className="text-6xl text-center mb-4">{caseItem.image}</div>
                  )}
                  <CardTitle>{caseItem.name}</CardTitle>
                  <CardDescription>{caseItem.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">{caseItem.price}₽</span>
                    <Badge variant="secondary">
                      {items.filter(i => i.caseId === caseItem.id).length} скинов
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => openEditCase(caseItem)} variant="outline" className="flex-1">
                      <Icon name="Pencil" size={16} className="mr-1" />
                      Изменить
                    </Button>
                    <Button onClick={() => deleteCase(caseItem.id)} variant="destructive" size="icon">
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Управление скинами</h2>
            <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingItem(null); setItemForm({ name: '', rarity: 'common', image: '', price: 0, caseId: 1 }); }} className="glow-primary">
                  <Icon name="Plus" size={20} className="mr-2" />
                  Добавить скин
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{editingItem ? 'Редактировать скин' : 'Добавить скин'}</DialogTitle>
                  <DialogDescription>
                    Заполните информацию о скине
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="item-name">Название</Label>
                    <Input
                      id="item-name"
                      value={itemForm.name}
                      onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                      placeholder="AK-47 | Огненный змей"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-rarity">Редкость</Label>
                    <Select value={itemForm.rarity} onValueChange={(value: Rarity) => setItemForm({ ...itemForm, rarity: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="legendary">Легендарный</SelectItem>
                        <SelectItem value="epic">Эпический</SelectItem>
                        <SelectItem value="rare">Редкий</SelectItem>
                        <SelectItem value="uncommon">Необычный</SelectItem>
                        <SelectItem value="common">Обычный</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="item-price">Цена (₽)</Label>
                    <Input
                      id="item-price"
                      type="number"
                      value={itemForm.price}
                      onChange={(e) => setItemForm({ ...itemForm, price: Number(e.target.value) })}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="item-case">Кейс</Label>
                    <Select value={itemForm.caseId.toString()} onValueChange={(value) => setItemForm({ ...itemForm, caseId: Number(value) })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cases.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="item-image">Изображение</Label>
                    <Input
                      id="item-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'item')}
                    />
                    {itemForm.image && (
                      <div className="mt-2">
                        <img src={itemForm.image} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                      </div>
                    )}
                  </div>
                  <Button onClick={saveItem} className="w-full" disabled={!itemForm.name || !itemForm.image}>
                    {editingItem ? 'Сохранить изменения' : 'Добавить скин'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <Card key={item.id} className="hover:border-primary/50 transition-all">
                <CardHeader className="pb-3">
                  <Badge className={`${rarityColors[item.rarity]} w-fit text-xs mb-2`}>
                    {item.rarity}
                  </Badge>
                  {item.image.startsWith('data:') ? (
                    <img src={item.image} alt={item.name} className="w-full h-32 object-cover rounded-lg" />
                  ) : (
                    <div className="text-5xl text-center py-4">{item.image}</div>
                  )}
                  <CardTitle className="text-base leading-tight">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary font-bold">{item.price}₽</span>
                    <span className="text-muted-foreground">
                      {cases.find(c => c.id === item.caseId)?.name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => openEditItem(item)} variant="outline" size="sm" className="flex-1">
                      <Icon name="Pencil" size={14} />
                    </Button>
                    <Button onClick={() => deleteItem(item.id)} variant="destructive" size="sm">
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;