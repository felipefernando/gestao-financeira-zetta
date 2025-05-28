
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckCircle, PlusCircle, User, Calendar, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreditPurchase {
  id: string;
  description: string;
  amount: number;
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
    amount: "",
    personName: "",
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.amount || !formData.personName || !formData.date) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      toast({
        title: "Erro",
        description: "O valor deve ser maior que zero.",
        variant: "destructive"
      });
      return;
    }

    const purchase: Omit<CreditPurchase, 'id'> = {
      description: formData.description,
      amount,
      personName: formData.personName,
      date: formData.date,
      isPaid: false
    };

    onAddPurchase(purchase);
    setFormData({
      description: "",
      amount: "",
      personName: "",
      date: new Date().toISOString().split('T')[0]
    });
    setIsAdding(false);
    
    toast({
      title: "Sucesso",
      description: "Compra adicionada com sucesso!",
    });
  };

  const togglePaymentStatus = (purchase: CreditPurchase) => {
    onUpdatePurchase(purchase.id, { isPaid: !purchase.isPaid });
    toast({
      title: "Atualizado",
      description: `Compra marcada como ${!purchase.isPaid ? 'paga' : 'pendente'}.`,
    });
  };

  const unpaidTotal = purchases.filter(p => !p.isPaid).reduce((sum, p) => sum + p.amount, 0);

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
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Ex: Jantar no restaurante"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="personName">Nome da Pessoa</Label>
                  <Input
                    id="personName"
                    value={formData.personName}
                    onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                    placeholder="Ex: João Silva"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
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
          {purchases.map((purchase) => (
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span className="font-semibold text-lg">R$ {purchase.amount.toLocaleString('pt-BR')}</span>
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
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePaymentStatus(purchase)}
                      className={purchase.isPaid ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
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
          ))}
        </div>
      )}
    </div>
  );
};
