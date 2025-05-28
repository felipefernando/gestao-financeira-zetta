
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, Plus, Minus } from "lucide-react";

interface Debt {
  id: string;
  name: string;
  totalValue: number;
  installments: number;
  installmentValue: number;
  paidInstallments: number;
  isPaid: boolean;
}

interface DebtListProps {
  debts: Debt[];
  onUpdateDebt: (debtId: string, updates: Partial<Debt>) => void;
  onDeleteDebt: (debtId: string) => void;
}

export const DebtList = ({ debts, onUpdateDebt, onDeleteDebt }: DebtListProps) => {
  const handlePaymentUpdate = (debt: Debt, increment: boolean) => {
    const newPaidInstallments = increment 
      ? Math.min(debt.paidInstallments + 1, debt.installments)
      : Math.max(debt.paidInstallments - 1, 0);
    
    const isPaid = newPaidInstallments === debt.installments;
    
    onUpdateDebt(debt.id, { 
      paidInstallments: newPaidInstallments,
      isPaid
    });
  };

  if (debts.length === 0) {
    return (
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma dívida cadastrada</h3>
          <p className="text-gray-500 text-center">Adicione suas dívidas parceladas para começar o controle financeiro.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {debts.map((debt) => {
        const progressPercentage = (debt.paidInstallments / debt.installments) * 100;
        const remainingValue = debt.totalValue - (debt.paidInstallments * debt.installmentValue);
        
        return (
          <Card key={debt.id} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-800">{debt.name}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={debt.isPaid ? "default" : "secondary"}>
                      {debt.isPaid ? "Quitada" : "Em pagamento"}
                    </Badge>
                    <Badge variant="outline">
                      {debt.paidInstallments}/{debt.installments} parcelas
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteDebt(debt.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Valor Total</p>
                  <p className="font-semibold">R$ {debt.totalValue.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-gray-500">Valor Parcela</p>
                  <p className="font-semibold">R$ {debt.installmentValue.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-gray-500">Restante</p>
                  <p className="font-semibold text-red-600">R$ {remainingValue.toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-gray-500">Progresso</p>
                  <p className="font-semibold">{progressPercentage.toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {debt.paidInstallments} de {debt.installments} parcelas pagas
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePaymentUpdate(debt, false)}
                      disabled={debt.paidInstallments === 0}
                      className="px-2"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePaymentUpdate(debt, true)}
                      disabled={debt.isPaid}
                      className="px-2"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
