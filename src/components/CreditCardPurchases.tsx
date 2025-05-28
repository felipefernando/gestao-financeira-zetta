
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, PlusCircle, User, Calendar, DollarSign, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

interface CreditCardPurchasesProps {
  purchases: CreditPurchase[];
  onAddPurchase: (purchase: Omit<CreditPurchase, 'id'>) => void;
  onUpdatePurchase: (purchaseId: string, updates: Partial<CreditPurchase>) => void;
  onDeletePurchase: (purchaseId: string) => void;
}

export const CreditCardPurchases = ({ 
  purchases, 
  onAddPurchase, 
  onUpdatePurchase, 
  onDeletePurchase 
}: CreditCardPurchasesProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    totalAmount: "",
    installments: "1",
    personName: "",
    date: new Date().toISOString().split('T')[0],
    paidInstallments: "0"
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.totalAmount || !formData.installments || !formData.personName || !formData.date) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const totalAmount = parseFloat(formData.totalAmount);
    const installments = parseInt(formData.installments);
    const paidInstallments = parseInt(formData.paidInstallments);

    if (totalAmount <= 0 || installments <= 0 || paidInstallments < 0 || paidInstallments > installments) {
      toast({
        title: "Erro",
        description: "Por favor, insira valores válidos.",
        variant: "destructive"
      });
      return;
    }

    const installmentValue = totalAmount / installments;

    const purchase: Omit<CreditPurchase, 'id'> = {
      description: formData.description,
      totalAmount,
      installments,
      installmentValue,
      paidInstallments,
      personName: formData.personName,
      date: formData.date,
      isPaid: paidInstallments === installments
    };

    onAddPurchase(purchase);
    setFormData({
      description: "",
      totalAmount: "",
      installments: "1",
      personName: "",
      date: new Date().toISOString().split('T')[0],
      paidInstallments: "0"
    });
    setIsAdding(false);
    
    toast({
      title: "Sucesso",
      description: "Compra adicionada com sucesso!",
    });
  };

  const markInstallmentAsPaid = (purchase: CreditPurchase) => {
    if (purchase.paidInstallments < purchase.installments) {
      const newPaidInstallments = purchase.paidInstallments + 1;
      const isPaid = newPaidInstallments === purchase.installments;
      
      onUpdatePurchase(purchase.id, { 
        paidInstallments: newPaidInstallments,
        isPaid 
      });
      
      toast({
        title: "Atualizado",
        description: `Parcela ${newPaidInstallments} de ${purchase.installments} marcada como paga.`,
      });
    }
  };

  const unpaidTotal = purchases
    .filter(p => !p.isPaid)
    .reduce((sum, p) => sum + ((p.installments - p.paidInstallments) * p.installmentValue), 0);

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Total Pendente de Recebimento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">R$ {unpaidTotal.toLocaleString('pt-BR')}</div>
          <p className="text-white/80">
            {purchases.filter(p => !p.isPaid).length} compra(s) pendente(s)
          </p>
        </CardContent>
      </Card>

      {/* Add Purchase Form */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Compras no Cartão para Terceiros</CardTitle>
            {!isAdding && (
              <Button onClick={() => setIsAdding(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Compra
              </Button>
            )}
          </div>
        </CardHeader>
        {isAdding && (
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição *</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Jantar no restaurante"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">Valor Total *</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="installments">Número de Parcelas *</Label>
                  <Input
                    id="installments"
                    type="number"
                    value={formData.installments}
                    onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                    placeholder="1"
                    min="1"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paidInstallments">Parcelas Já Pagas</Label>
                  <Input
                    id="paidInstallments"
                    type="number"
                    value={formData.paidInstallments}
                    onChange={(e) => setFormData({ ...formData, paidInstallments: e.target.value })}
                    placeholder="0"
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="personName">Nome da Pessoa *</Label>
                  <Input
                    id="personName"
                    value={formData.personName}
                    onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                    placeholder="Ex: João Silva"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Data *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Adicionar Compra
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Purchases List */}
      {purchases.length === 0 ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma compra cadastrada</h3>
            <p className="text-gray-500 text-center">Adicione compras feitas no cartão para terceiros para controlar os valores a receber.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {purchases.map((purchase) => {
            const remainingInstallments = purchase.installments - purchase.paidInstallments;
            const remainingAmount = remainingInstallments * purchase.installmentValue;
            
            return (
              <Card key={purchase.id} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{purchase.description}</h3>
                        <Badge variant={purchase.isPaid ? "default" : "secondary"}>
                          {purchase.isPaid ? "Pago" : "Pendente"}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-semibold text-lg">R$ {purchase.totalAmount.toLocaleString('pt-BR')}</p>
                            <p className="text-xs text-gray-500">Total</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-gray-500" />
                          <div>
                            <p className="font-semibold">R$ {purchase.installmentValue.toLocaleString('pt-BR')}</p>
                            <p className="text-xs text-gray-500">Por parcela</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-500" />
                          <span>{purchase.personName}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{new Date(purchase.date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {purchase.paidInstallments}/{purchase.installments} parcelas pagas
                          </Badge>
                        </div>
                        {!purchase.isPaid && (
                          <div className="text-orange-600 font-semibold">
                            Restam: R$ {remainingAmount.toLocaleString('pt-BR')}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      {!purchase.isPaid && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markInstallmentAsPaid(purchase)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Pagar Parcela
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeletePurchase(purchase.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
