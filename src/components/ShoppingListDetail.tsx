
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, ShoppingCart, Import, Check, X } from "lucide-react";
import { ImportItemsDialog } from "@/components/ImportItemsDialog";
import { ShoppingList, ShoppingItem } from "@/pages/ShoppingLists";

interface ShoppingListDetailProps {
  list: ShoppingList;
  onUpdateItem: (listId: string, itemId: string, updates: Partial<ShoppingItem>) => void;
  onDeleteItem: (listId: string, itemId: string) => void;
  onAddItem: (listId: string, item: Omit<ShoppingItem, 'id' | 'total' | 'checked'>) => void;
  onUpdateList: (listId: string, updates: Partial<ShoppingList>) => void;
  allLists: ShoppingList[];
  onImportItems: (listId: string, items: Omit<ShoppingItem, 'id' | 'checked'>[]) => void;
}

export const ShoppingListDetail = ({ 
  list, 
  onUpdateItem, 
  onDeleteItem, 
  onAddItem, 
  onUpdateList,
  allLists,
  onImportItems
}: ShoppingListDetailProps) => {
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    price: 0
  });
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.name.trim() && newItem.quantity > 0 && newItem.price >= 0) {
      onAddItem(list.id, newItem);
      setNewItem({ name: '', quantity: 1, price: 0 });
    }
  };

  const handleItemCheck = (itemId: string, checked: boolean) => {
    onUpdateItem(list.id, itemId, { checked });
  };

  const toggleListCompletion = () => {
    onUpdateList(list.id, { completed: !list.completed });
  };

  const checkedItems = list.items.filter(item => item.checked).length;
  const totalItems = list.items.length;

  return (
    <div className="space-y-6">
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                {list.name}
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {list.date} • {checkedItems}/{totalItems} itens coletados
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsImportDialogOpen(true)}
                disabled={allLists.length === 0}
              >
                <Import className="mr-2 h-4 w-4" />
                Importar Itens
              </Button>
              <Button
                onClick={toggleListCompletion}
                variant={list.completed ? "destructive" : "default"}
                className={list.completed ? "" : "bg-green-600 hover:bg-green-700"}
              >
                {list.completed ? (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Reabrir Lista
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Finalizar Lista
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {!list.completed && (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Adicionar Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="itemName">Nome do Produto</Label>
                  <Input
                    id="itemName"
                    type="text"
                    placeholder="Ex: Arroz, Feijão..."
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    step="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="price">Preço Unitário (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Item
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {list.items.length > 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Itens da Lista</span>
              <div className="text-2xl font-bold text-green-600">
                Total: R$ {list.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-center">Quantidade</TableHead>
                  <TableHead className="text-right">Preço Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.items.map((item) => (
                  <TableRow key={item.id} className={item.checked ? "opacity-60" : ""}>
                    <TableCell>
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={(checked) => handleItemCheck(item.id, checked as boolean)}
                        disabled={list.completed}
                      />
                    </TableCell>
                    <TableCell className={`font-medium ${item.checked ? "line-through" : ""}`}>
                      {item.name}
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">
                      R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell>
                      {!list.completed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteItem(list.id, item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {list.items.length === 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="py-12 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhum item adicionado à lista ainda.</p>
            <p className="text-sm text-gray-500">Adicione produtos acima para começar sua lista de compras.</p>
          </CardContent>
        </Card>
      )}

      <ImportItemsDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        availableLists={allLists}
        onImportItems={(items) => onImportItems(list.id, items)}
      />
    </div>
  );
};
