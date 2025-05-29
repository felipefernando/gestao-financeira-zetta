
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, List, Import, Check, X } from "lucide-react";
import { ShoppingListDetail } from "@/components/ShoppingListDetail";
import { ShoppingListHistory } from "@/components/ShoppingListHistory";
import { ImportItemsDialog } from "@/components/ImportItemsDialog";

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
  checked: boolean;
}

export interface ShoppingList {
  id: string;
  name: string;
  date: string;
  items: ShoppingItem[];
  totalAmount: number;
  completed: boolean;
}

const ShoppingLists = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');

  const createNewList = () => {
    if (newListName.trim()) {
      const newList: ShoppingList = {
        id: Date.now().toString(),
        name: newListName,
        date: new Date().toISOString().split('T')[0],
        items: [],
        totalAmount: 0,
        completed: false
      };
      setLists([newList, ...lists]);
      setActiveListId(newList.id);
      setNewListName('');
      setIsCreateDialogOpen(false);
    }
  };

  const updateList = (listId: string, updates: Partial<ShoppingList>) => {
    setLists(lists.map(list => 
      list.id === listId ? { ...list, ...updates } : list
    ));
  };

  const deleteList = (listId: string) => {
    setLists(lists.filter(list => list.id !== listId));
    if (activeListId === listId) {
      setActiveListId(null);
    }
  };

  const addItemToList = (listId: string, item: Omit<ShoppingItem, 'id' | 'total' | 'checked'>) => {
    const total = item.quantity * item.price;
    const newItem: ShoppingItem = { 
      ...item, 
      id: Date.now().toString(),
      total,
      checked: false
    };
    
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        const updatedItems = [...list.items, newItem];
        const totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);
        return { ...list, items: updatedItems, totalAmount };
      }
      return list;
    });
    
    setLists(updatedLists);
  };

  const updateItemInList = (listId: string, itemId: string, updates: Partial<ShoppingItem>) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        const updatedItems = list.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        );
        const totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);
        return { ...list, items: updatedItems, totalAmount };
      }
      return list;
    });
    
    setLists(updatedLists);
  };

  const deleteItemFromList = (listId: string, itemId: string) => {
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        const updatedItems = list.items.filter(item => item.id !== itemId);
        const totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);
        return { ...list, items: updatedItems, totalAmount };
      }
      return list;
    });
    
    setLists(updatedLists);
  };

  const importItemsToList = (listId: string, items: Omit<ShoppingItem, 'id' | 'checked'>[]) => {
    const newItems: ShoppingItem[] = items.map(item => ({
      ...item,
      id: Date.now().toString() + Math.random(),
      checked: false
    }));
    
    const updatedLists = lists.map(list => {
      if (list.id === listId) {
        const updatedItems = [...list.items, ...newItems];
        const totalAmount = updatedItems.reduce((sum, item) => sum + item.total, 0);
        return { ...list, items: updatedItems, totalAmount };
      }
      return list;
    });
    
    setLists(updatedLists);
  };

  const activeList = lists.find(list => list.id === activeListId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Listas de Compras
          </h1>
          <p className="text-gray-600 text-lg">Organize suas compras e mantenha o histórico</p>
        </div>

        <Tabs defaultValue="current" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="current" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Lista Atual
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Histórico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Lista Atual</h2>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Nova Lista
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Criar Nova Lista</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="listName">Nome da Lista</Label>
                      <Input
                        id="listName"
                        placeholder="Ex: Compras do Mês, Feira Semanal..."
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && createNewList()}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={createNewList} className="flex-1">
                        Criar Lista
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {activeList ? (
              <ShoppingListDetail
                list={activeList}
                onUpdateItem={updateItemInList}
                onDeleteItem={deleteItemFromList}
                onAddItem={addItemToList}
                onUpdateList={updateList}
                allLists={lists.filter(l => l.id !== activeList.id)}
                onImportItems={importItemsToList}
              />
            ) : (
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="py-12 text-center">
                  <List className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Nenhuma lista ativa.</p>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeira Lista
                  </Button>
                </CardContent>
              </Card>
            )}

            {lists.length > 0 && (
              <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Selecionar Lista</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {lists.map(list => (
                      <Card 
                        key={list.id} 
                        className={`cursor-pointer transition-all ${
                          activeListId === list.id 
                            ? 'ring-2 ring-green-500 bg-green-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setActiveListId(list.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold">{list.name}</h3>
                            {list.completed && <Check className="h-4 w-4 text-green-600" />}
                          </div>
                          <p className="text-sm text-gray-500">{list.date}</p>
                          <p className="text-sm font-medium">
                            {list.items.length} item(s) - R$ {list.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <ShoppingListHistory 
              lists={lists}
              onDeleteList={deleteList}
              onSelectList={setActiveListId}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ShoppingLists;
