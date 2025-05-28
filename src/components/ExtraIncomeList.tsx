
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, PlusCircle, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { ExtraIncomeDialog } from "./ExtraIncomeDialog";

interface ExtraIncome {
  id: string;
  name: string;
  amount: number;
}

interface ExtraIncomeListProps {
  extraIncomes: ExtraIncome[];
  onAddExtraIncome: (income: Omit<ExtraIncome, 'id'>) => void;
  onDeleteExtraIncome: (incomeId: string) => void;
}

export const ExtraIncomeList = ({ 
  extraIncomes, 
  onAddExtraIncome, 
  onDeleteExtraIncome 
}: ExtraIncomeListProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const totalExtraIncome = extraIncomes.reduce((sum, income) => sum + income.amount, 0);

  const handleDelete = (incomeId: string) => {
    onDeleteExtraIncome(incomeId);
    toast({
      title: "Excluído",
      description: "Renda extra removida com sucesso.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Total Rendas Extras
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">R$ {totalExtraIncome.toLocaleString('pt-BR')}</div>
          <p className="text-white/80">
            {extraIncomes.length} renda(s) extra(s)
          </p>
        </CardContent>
      </Card>

      {/* Add Extra Income Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Rendas Extras</h2>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Renda
        </Button>
      </div>

      {/* Extra Incomes List */}
      {extraIncomes.length === 0 ? (
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhuma renda extra cadastrada</h3>
            <p className="text-gray-500 text-center">Adicione rendas extras como freelances, vendas ou outras fontes de renda.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {extraIncomes.map((income) => (
            <Card key={income.id} className="bg-white/60 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{income.name}</h3>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        Ativa
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span className="font-semibold text-xl">R$ {income.amount.toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(income.id)}
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

      <ExtraIncomeDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAddExtraIncome={onAddExtraIncome}
      />
    </div>
  );
};
