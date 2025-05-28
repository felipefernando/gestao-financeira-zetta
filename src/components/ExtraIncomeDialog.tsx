
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ExtraIncome {
  id: string;
  name: string;
  amount: number;
}

interface ExtraIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddExtraIncome: (income: Omit<ExtraIncome, 'id'>) => void;
}

export const ExtraIncomeDialog = ({ open, onOpenChange, onAddExtraIncome }: ExtraIncomeDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: ""
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount) {
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

    const extraIncome: Omit<ExtraIncome, 'id'> = {
      name: formData.name,
      amount
    };

    onAddExtraIncome(extraIncome);
    setFormData({
      name: "",
      amount: ""
    });
    onOpenChange(false);
    
    toast({
      title: "Sucesso",
      description: "Renda extra adicionada com sucesso!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Renda Extra</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Renda *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Freelance, Vendas, etc."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Valor *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              Adicionar Renda
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
