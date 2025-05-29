
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar, ShoppingCart, Trash2, Eye } from "lucide-react";
import { ShoppingList } from "@/pages/ShoppingLists";

interface ShoppingListHistoryProps {
  lists: ShoppingList[];
  onDeleteList: (listId: string) => void;
  onSelectList: (listId: string) => void;
}

export const ShoppingListHistory = ({ lists, onDeleteList, onSelectList }: ShoppingListHistoryProps) => {
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'total'>('date');

  const sortedLists = [...lists].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'name':
        return a.name.localeCompare(b.name);
      case 'total':
        return b.totalAmount - a.totalAmount;
      default:
        return 0;
    }
  });

  const handleViewList = (listId: string) => {
    onSelectList(listId);
    // Scroll to top to see the active list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Histórico de Listas</h2>
        <div className="flex gap-2">
          <Button
            variant={sortBy === 'date' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('date')}
          >
            Data
          </Button>
          <Button
            variant={sortBy === 'name' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('name')}
          >
            Nome
          </Button>
          <Button
            variant={sortBy === 'total' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSortBy('total')}
          >
            Valor
          </Button>
        </div>
      </div>

      {sortedLists.length > 0 ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Todas as Listas ({sortedLists.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-center">Itens</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="w-24">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedLists.map((list) => {
                  const checkedItems = list.items.filter(item => item.checked).length;
                  const totalItems = list.items.length;
                  
                  return (
                    <TableRow key={list.id}>
                      <TableCell className="font-medium">{list.name}</TableCell>
                      <TableCell>{formatDate(list.date)}</TableCell>
                      <TableCell className="text-center">
                        {totalItems > 0 ? `${checkedItems}/${totalItems}` : '0'}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        R$ {list.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={list.completed ? 'default' : 'secondary'}>
                          {list.completed ? 'Finalizada' : 'Em andamento'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewList(list.id)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteList(list.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="py-12 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">Nenhuma lista criada ainda.</p>
            <p className="text-sm text-gray-500">Crie sua primeira lista para começar o histórico.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
