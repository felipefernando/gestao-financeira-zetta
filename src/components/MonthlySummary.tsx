
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, CreditCard, Receipt, Users } from "lucide-react";

interface Debt {
  id: string;
  name: string;
  totalValue: number;
  installments: number;
  installmentValue: number;
  paidInstallments: number;
  isPaid: boolean;
}

interface CreditPurchase {
  id: string;
  description: string;
  amount: number;
  personName: string;
  date: string;
  isPaid: boolean;
}

interface FixedExpense {
  id: string;
  name: string;
  amount: number;
  category: string;
}

interface MonthlySummaryProps {
  monthlyIncome: number;
  debts: Debt[];
  creditPurchases: CreditPurchase[];
  fixedExpenses: FixedExpense[];
  detailed?: boolean;
}

export const MonthlySummary = ({ 
  monthlyIncome, 
  debts, 
  creditPurchases, 
  fixedExpenses, 
  detailed = false 
}: MonthlySummaryProps) => {
  const monthlyDebtPayments = debts.reduce((sum, debt) => 
    debt.isPaid ? 0 : sum + debt.installmentValue, 0
  );
  const totalFixedExpenses = fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const pendingCreditReceivables = creditPurchases.filter(p => !p.isPaid).reduce((sum, p) => sum + p.amount, 0);
  
  const totalMonthlyExpenses = monthlyDebtPayments + totalFixedExpenses;
  const finalBalance = monthlyIncome - totalMonthlyExpenses + pendingCreditReceivables;
  const netBalance = monthlyIncome - totalMonthlyExpenses;
  
  const expensePercentage = monthlyIncome > 0 ? (totalMonthlyExpenses / monthlyIncome) * 100 : 0;

  if (!detailed) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Salário Mensal:</span>
            <span className="font-semibold text-green-600">R$ {monthlyIncome.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Gastos Fixos:</span>
            <span className="font-semibold text-red-600">R$ {totalFixedExpenses.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Parcelas de Dívidas:</span>
            <span className="font-semibold text-red-600">R$ {monthlyDebtPayments.toLocaleString('pt-BR')}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-800">Saldo Líquido:</span>
              <span className={`font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                R$ {netBalance.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800 mb-2">
              {expensePercentage.toFixed(1)}%
            </div>
            <p className="text-sm text-gray-600 mb-3">do salário comprometido</p>
            <Progress value={Math.min(expensePercentage, 100)} className="h-2" />
          </div>
          {pendingCreditReceivables > 0 && (
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-600">A receber do cartão:</p>
              <p className="font-semibold text-orange-700">R$ {pendingCreditReceivables.toLocaleString('pt-BR')}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Income and Expenses Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Receita Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlyIncome.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Gastos Fixos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {totalFixedExpenses.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Parcelas Dívidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {monthlyDebtPayments.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              A Receber
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {pendingCreditReceivables.toLocaleString('pt-BR')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Health Indicator */}
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Saúde Financeira Mensal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Percentual de gastos comprometidos:</span>
            <span className={`font-bold ${expensePercentage <= 70 ? 'text-green-600' : expensePercentage <= 85 ? 'text-yellow-600' : 'text-red-600'}`}>
              {expensePercentage.toFixed(1)}%
            </span>
          </div>
          <Progress value={Math.min(expensePercentage, 100)} className="h-3" />
          <div className="text-sm text-gray-600">
            {expensePercentage <= 70 && "✅ Situação financeira saudável"}
            {expensePercentage > 70 && expensePercentage <= 85 && "⚠️ Atenção aos gastos"}
            {expensePercentage > 85 && "🚨 Gastos comprometendo o orçamento"}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Resumo de Dívidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {debts.length === 0 ? (
              <p className="text-gray-500">Nenhuma dívida cadastrada</p>
            ) : (
              debts.map((debt) => (
                <div key={debt.id} className="flex justify-between items-center p-2 bg-white/50 rounded">
                  <div>
                    <p className="font-medium">{debt.name}</p>
                    <p className="text-sm text-gray-600">
                      {debt.paidInstallments}/{debt.installments} parcelas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">R$ {debt.installmentValue.toLocaleString('pt-BR')}/mês</p>
                    <p className="text-sm text-gray-600">
                      Restam R$ {(debt.totalValue - (debt.paidInstallments * debt.installmentValue)).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Compras Pendentes de Recebimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {creditPurchases.filter(p => !p.isPaid).length === 0 ? (
              <p className="text-gray-500">Nenhuma compra pendente</p>
            ) : (
              creditPurchases.filter(p => !p.isPaid).map((purchase) => (
                <div key={purchase.id} className="flex justify-between items-center p-2 bg-white/50 rounded">
                  <div>
                    <p className="font-medium">{purchase.description}</p>
                    <p className="text-sm text-gray-600">{purchase.personName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-orange-600">R$ {purchase.amount.toLocaleString('pt-BR')}</p>
                    <p className="text-sm text-gray-600">{new Date(purchase.date).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Final Balance Summary */}
      <Card className={`${netBalance >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-pink-600'} text-white border-0 shadow-lg`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {netBalance >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            Resultado Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-white/80 text-sm">Saldo Líquido (sem recebíveis):</p>
              <p className="text-2xl font-bold">R$ {netBalance.toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-white/80 text-sm">A receber:</p>
              <p className="text-xl font-bold">R$ {pendingCreditReceivables.toLocaleString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-white/80 text-sm">Saldo Final (com recebíveis):</p>
              <p className="text-2xl font-bold">R$ {finalBalance.toLocaleString('pt-BR')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
