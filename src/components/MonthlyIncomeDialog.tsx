
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface MonthlyIncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentIncome: number;
  onUpdateIncome: (income: number) => void;
}

export const MonthlyIncomeDialog = ({ 
  open, 
  onOpenChange, 
  currentIncome, 
  onUpdateIncome 
}: MonthlyIncomeDialogProps) => {
  const [income, setIncome] = useState(currentIncome.toString());
  const { toast } = useToast();

  useEffect(() => {
    setIncome(currentIncome.toString());
  }, [currentIncome]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericIncome = parseFloat(income);
    
    if (isNaN(numericIncome) || numericIncome < 0) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor válido.",
        variant: "destructive"
      });
      return;
    }

    onUpdateIncome(numericIncome);
    onOpenChange(false);
    
    toast({
      title: "Sucesso",
      description: "Salário mensal atualizado com sucesso!",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Atualizar Salário Mensal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="income">Salário Líquido Mensal</Label>
            <Input
              id="income"
              type="number"
              step="0.01"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              placeholder="0.00"
              className="text-lg"
            />
            <p className="text-sm text-gray-500">
              Insira o valor líquido que você recebe mensalmente
            </p>
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              Atualizar Salário
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
