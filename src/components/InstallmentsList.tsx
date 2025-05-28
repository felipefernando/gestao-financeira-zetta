
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, DollarSign } from "lucide-react";

interface CreditPurchase {
  id: string;
  description: string;
  totalAmount: number;
  installments: number;
  installmentValue: number;
  paidInstallments: number;
  personName: string;
  date: string;
  isPaid: boolean;
}

interface InstallmentsListProps {
  purchases: CreditPurchase[];
}

export const InstallmentsList = ({ purchases }: InstallmentsListProps) => {
  const generateInstallmentsList = () => {
    const installmentsList: Array<{
      purchaseId: string;
      description: string;
      personName: string;
      installmentNumber: number;
      value: number;
      isPaid: boolean;
      dueDate: string;
    }> = [];

    purchases.forEach(purchase => {
      const purchaseDate = new Date(purchase.date);
      
      for (let i = 1; i <= purchase.installments; i++) {
        const dueDate = new Date(purchaseDate);
        dueDate.setMonth(dueDate.getMonth() + i - 1);
        
        installmentsList.push({
          purchaseId: purchase.id,
          description: purchase.description,
          personName: purchase.personName,
          installmentNumber: i,
          value: purchase.installmentValue,
          isPaid: i <= purchase.paidInstallments,
          dueDate: dueDate.toISOString().split('T')[0]
        });
      }
    });

    return installmentsList.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const installments = generateInstallmentsList();
  const pendingInstallments = installments.filter(inst => !inst.isPaid);
  const totalPending = pendingInstallments.reduce((sum, inst) => sum + inst.value, 0);

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Parcelas Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">R$ {totalPending.toLocaleString('pt-BR')}</div>
          <p className="text-white/80">
            {pendingInstallments.length} parcela(s) pendente(s)
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {installments.map((installment, index) => (
          <Card 
            key={`${installment.purchaseId}-${installment.installmentNumber}`}
            className={`bg-white/60 backdrop-blur-sm border-0 shadow-lg ${
              installment.isPaid ? 'opacity-60' : ''
            }`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{installment.description}</h4>
                    <Badge variant={installment.isPaid ? "default" : "secondary"}>
                      Parcela {installment.installmentNumber}
                    </Badge>
                    <Badge variant={installment.isPaid ? "default" : "destructive"}>
                      {installment.isPaid ? "Paga" : "Pendente"}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="font-semibold">R$ {installment.value.toLocaleString('pt-BR')}</p>
                        <p className="text-xs text-gray-500">Valor da parcela</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{installment.personName}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(installment.dueDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {installments.length === 0 && (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma parcela encontrada</h3>
            <p className="text-gray-500 text-center">Adicione compras no cartão para ver as parcelas aqui.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
