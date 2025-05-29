
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Import, ShoppingCart } from "lucide-react";
import { ShoppingList, ShoppingItem } from "@/pages/ShoppingLists";

interface ImportItemsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableLists: ShoppingList[];
  onImportItems: (items: Omit<ShoppingItem, 'id' | 'checked'>[]) => void;
}

export const ImportItemsDialog = ({ 
  open, 
  onOpenChange, 
  availableLists, 
  onImportItems 
}: ImportItemsDialogProps) => {
  const [selectedListId, setSelectedListId] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const selectedList = availableLists.find(list => list.id === selectedListId);

  const handleSelectAll = (checked: boolean) => {
    if (checked && selectedList) {
      setSelectedItems(new Set(selectedList.items.map(item => item.id)));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleItemSelect = (itemId: string, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(itemId);
    } else {
      newSelected.delete(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleImport = () => {
    if (selectedList && selectedItems.size > 0) {
      const itemsToImport = selectedList.items
        .filter(item => selectedItems.has(item.id))
        .map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        }));
      
      onImportItems(itemsToImport);
      setSelectedListId('');
      setSelectedItems(new Set());
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setSelectedListId('');
    setSelectedItems(new Set());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Import className="h-5 w-5" />
            Importar Itens de Outra Lista
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="sourceList">Selecionar Lista de Origem</Label>
            <Select value={selectedListId} onValueChange={setSelectedListId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha uma lista para importar itens" />
              </SelectTrigger>
              <SelectContent>
                {availableLists.map(list => (
                  <SelectItem key={list.id} value={list.id}>
                    {list.name} - {list.date} ({list.items.length} itens)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedList && selectedList.items.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Selecionar Itens para Importar</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="selectAll"
                    checked={selectedItems.size === selectedList.items.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <Label htmlFor="selectAll" className="text-sm">
                    Selecionar Todos
                  </Label>
                </div>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-center">Quantidade</TableHead>
                      <TableHead className="text-right">Preço Unit.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedList.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedItems.has(item.id)}
                            onCheckedChange={(checked) => handleItemSelect(item.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          R$ {item.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {selectedItems.size > 0 && (
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-sm text-green-800">
                    <strong>{selectedItems.size}</strong> item(s) selecionado(s) para importar
                  </p>
                </div>
              )}
            </div>
          )}

          {selectedList && selectedList.items.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Esta lista não possui itens para importar.</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button 
              onClick={handleImport}
              disabled={selectedItems.size === 0}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            >
              <Import className="mr-2 h-4 w-4" />
              Importar {selectedItems.size} Item(s)
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
