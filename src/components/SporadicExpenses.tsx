
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, Plus, ShoppingCart } from "lucide-react";

interface SporadicExpense {
  id: string;
  name: string;
  amount: number;
  date: string;
}

interface SporadicExpensesProps {
  expenses: SporadicExpense[];
  onAddExpense: (expense: Omit<SporadicExpense, 'id'>) => void;
  onDeleteExpense: (expenseId: string) => void;
}

export const SporadicExpenses = ({
  expenses,
  onAddExpense,
  onDeleteExpense
}: SporadicExpensesProps) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !amount || parseFloat(amount) <= 0) {
      return;
    }

    onAddExpense({
      name: name.trim(),
      amount: parseFloat(amount),
      date
    });

    setName('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const totalSporadicExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Adicionar Gasto Esporádico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="name">Descrição do Gasto</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Presente, Viagem, Emergência"
                  required
                />
              </div>
              <div>
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Gasto
            </Button>
          </form>
        </CardContent>
      </Card>

      {totalSporadicExpenses > 0 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-orange-600" />
                <span className="font-medium text-orange-800">Total de Gastos Esporádicos:</span>
              </div>
              <span className="text-xl font-bold text-orange-600">
                R$ {totalSporadicExpenses.toLocaleString('pt-BR')}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {expenses.length === 0 ? (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-8 text-center">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">Nenhum gasto esporádico cadastrado</p>
            <p className="text-sm text-gray-500 mt-2">
              Adicione gastos extras que não são fixos mensais
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <Card key={expense.id} className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-medium text-gray-800">{expense.name}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(expense.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-red-600">
                      R$ {expense.amount.toLocaleString('pt-BR')}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteExpense(expense.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
