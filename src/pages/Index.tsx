import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

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

const rarityGlow: Record<Rarity, string> = {
  legendary: 'glow-legendary',
  epic: 'glow-epic',
  rare: 'glow-rare',
  uncommon: '',
  common: '',
};

const cases: CaseType[] = [
  { id: 1, name: 'Стартовый кейс', price: 100, image: '🎁', description: 'Идеально для новичков' },
  { id: 2, name: 'Золотой кейс', price: 500, image: '💎', description: 'Повышенный шанс редких скинов' },
  { id: 3, name: 'Легендарный кейс', price: 1000, image: '👑', description: 'Эксклюзивные легендарные скины' },
];

const allItems: Item[] = [
  { id: 1, name: 'AK-47 | Огненный змей', rarity: 'legendary', image: '🔥', price: 2500, caseId: 3 },
  { id: 2, name: 'AWP | Азимов', rarity: 'epic', image: '⚡', price: 1200, caseId: 2 },
  { id: 3, name: 'M4A4 | Неон', rarity: 'rare', image: '🌟', price: 500, caseId: 1 },
  { id: 4, name: 'Desert Eagle | Пламя', rarity: 'epic', image: '💥', price: 800, caseId: 2 },
  { id: 5, name: 'Glock-18 | Градиент', rarity: 'uncommon', image: '🎨', price: 200, caseId: 1 },
  { id: 6, name: 'USP-S | Затмение', rarity: 'rare', image: '🌙', price: 450, caseId: 2 },
  { id: 7, name: 'Нож-бабочка | Убийство', rarity: 'legendary', image: '🦋', price: 3000, caseId: 3 },
  { id: 8, name: 'P90 | Азиимов', rarity: 'uncommon', image: '💫', price: 150, caseId: 1 },
];

const Index = () => {
  const [balance, setBalance] = useState(5000);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [wonItem, setWonItem] = useState<Item | null>(null);

  const openCase = (caseItem: CaseType) => {
    if (balance < caseItem.price) {
      toast.error('Недостаточно средств!');
      return;
    }

    setIsOpening(true);
    setBalance(balance - caseItem.price);

    const availableItems = allItems.filter((item) => item.caseId === caseItem.id);
    const rarityWeights = { legendary: 5, epic: 15, rare: 30, uncommon: 40, common: 60 };
    
    const weightedItems = availableItems.flatMap((item) =>
      Array(rarityWeights[item.rarity]).fill(item)
    );
    
    setTimeout(() => {
      const randomItem = weightedItems[Math.floor(Math.random() * weightedItems.length)];
      setWonItem(randomItem);
      setInventory([...inventory, randomItem]);
      setIsOpening(false);
      
      toast.success(`Вы выиграли: ${randomItem.name}!`, {
        description: `Ценность: ${randomItem.price}₽`,
      });
    }, 3000);
  };

  const sellItem = (item: Item) => {
    setBalance(balance + item.price);
    setInventory(inventory.filter((i) => i.id !== item.id || i !== item));
    toast.success(`Предмет продан за ${item.price}₽`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🎮</div>
              <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                CS2 CASES
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Card className="border-primary/20 bg-primary/10">
                <CardContent className="py-2 px-4 flex items-center gap-2">
                  <Icon name="Wallet" className="text-primary" size={20} />
                  <span className="text-xl font-bold text-primary">{balance}₽</span>
                </CardContent>
              </Card>
              <Button variant="outline" size="icon" className="border-primary/50">
                <Icon name="User" className="text-primary" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="cases" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
            <TabsTrigger value="cases" className="text-base">
              <Icon name="Package" size={18} className="mr-2" />
              Кейсы
            </TabsTrigger>
            <TabsTrigger value="inventory" className="text-base">
              <Icon name="Backpack" size={18} className="mr-2" />
              Инвентарь
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-8">
            {isOpening && (
              <Card className="border-primary/50 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-slide-reveal" />
                <CardContent className="py-12 text-center">
                  <div className="text-6xl animate-spin-slow mb-4">🎰</div>
                  <h2 className="text-3xl font-bold mb-2">Открываем кейс...</h2>
                  <p className="text-muted-foreground">Удача на вашей стороне!</p>
                </CardContent>
              </Card>
            )}

            {wonItem && !isOpening && (
              <Card className={`border-2 ${rarityGlow[wonItem.rarity]} animate-bounce-in`}>
                <CardContent className="py-8 text-center">
                  <Badge className={`${rarityColors[wonItem.rarity]} text-lg px-4 py-1 mb-4`}>
                    {wonItem.rarity.toUpperCase()}
                  </Badge>
                  <div className="text-7xl mb-4">{wonItem.image}</div>
                  <h3 className="text-2xl font-bold mb-2">{wonItem.name}</h3>
                  <p className="text-3xl font-black text-primary mb-4">{wonItem.price}₽</p>
                  <Button onClick={() => setWonItem(null)} size="lg" className="glow-primary">
                    Закрыть
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((caseItem) => (
                <Card
                  key={caseItem.id}
                  className="group hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20"
                >
                  <CardHeader>
                    <div className="text-6xl mb-4 text-center group-hover:scale-110 transition-transform">
                      {caseItem.image}
                    </div>
                    <CardTitle className="text-xl">{caseItem.name}</CardTitle>
                    <CardDescription>{caseItem.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{caseItem.price}₽</span>
                      <Badge variant="secondary" className="text-xs">
                        {allItems.filter((i) => i.caseId === caseItem.id).length} предметов
                      </Badge>
                    </div>
                    <Button
                      onClick={() => openCase(caseItem)}
                      disabled={isOpening || balance < caseItem.price}
                      className="w-full text-lg py-6 font-bold glow-primary"
                      size="lg"
                    >
                      <Icon name="Unlock" className="mr-2" size={20} />
                      Открыть
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inventory">
            {inventory.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                  <div className="text-6xl mb-4 opacity-50">📦</div>
                  <h3 className="text-2xl font-bold mb-2">Инвентарь пуст</h3>
                  <p className="text-muted-foreground mb-6">Откройте кейсы, чтобы получить скины!</p>
                  <Button onClick={() => document.querySelector<HTMLElement>('[value="cases"]')?.click()}>
                    Открыть кейсы
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {inventory.map((item, index) => (
                  <Card
                    key={`${item.id}-${index}`}
                    className={`hover:border-${item.rarity} transition-all hover:scale-105`}
                  >
                    <CardHeader className="pb-3">
                      <Badge className={`${rarityColors[item.rarity]} w-fit text-xs`}>
                        {item.rarity}
                      </Badge>
                      <div className={`text-5xl text-center my-3 ${rarityGlow[item.rarity]}`}>
                        {item.image}
                      </div>
                      <CardTitle className="text-base leading-tight">{item.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-xl font-bold text-primary">{item.price}₽</div>
                      <Button
                        onClick={() => sellItem(item)}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <Icon name="DollarSign" size={16} className="mr-1" />
                        Продать
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
