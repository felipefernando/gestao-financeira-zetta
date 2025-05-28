
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Debt {
  name: string;
  totalValue: number;
  installments: number;
  installmentValue: number;
  paidInstallments: number;
  isPaid: boolean;
}

interface AddDebtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddDebt: (debt: Debt) => void;
}

export const AddDebtDialog = ({ open, onOpenChange, onAddDebt }: AddDebtDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    totalValue: "",
    installments: "",
    installmentValue: "",
    paidInstallments: "0"
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.totalValue || !formData.installments || !formData.installmentValue) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const totalValue = parseFloat(formData.totalValue);
    const installments = parseInt(formData.installments);
    const installmentValue = parseFloat(formData.installmentValue);
    const paidInstallments = parseInt(formData.paidInstallments);

    if (totalValue <= 0 || installments <= 0 || installmentValue <= 0 || paidInstallments < 0 || paidInstallments > installments) {
      toast({
        title: "Erro",
        description: "Por favor, insira valores válidos.",
        variant: "destructive"
      });
      return;
    }

    const debt: Debt = {
      name: formData.name,
      totalValue,
      installments,
      installmentValue,
      paidInstallments,
      isPaid: paidInstallments === installments
    };

    onAddDebt(debt);
    setFormData({
      name: "",
      totalValue: "",
      installments: "",
      installmentValue: "",
      paidInstallments: "0"
    });
    onOpenChange(false);
    
    toast({
      title: "Sucesso",
      description: "Dívida adicionada com sucesso!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Nova Dívida</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Dívida *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Financiamento do carro"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalValue">Valor Total *</Label>
            <Input
              id="totalValue"
              type="number"
              step="0.01"
              value={formData.totalValue}
              onChange={(e) => setFormData({ ...formData, totalValue: e.target.value })}
              placeholder="0.00"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="installments">Nº Parcelas *</Label>
              <Input
                id="installments"
                type="number"
                value={formData.installments}
                onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                placeholder="12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="installmentValue">Valor Parcela *</Label>
              <Input
                id="installmentValue"
                type="number"
                step="0.01"
                value={formData.installmentValue}
                onChange={(e) => setFormData({ ...formData, installmentValue: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="paidInstallments">Parcelas Já Pagas</Label>
            <Input
              id="paidInstallments"
              type="number"
              value={formData.paidInstallments}
              onChange={(e) => setFormData({ ...formData, paidInstallments: e.target.value })}
              placeholder="0"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Adicionar Dívida
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
