
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, CreditCard, Receipt, Wallet, TrendingUp, Calendar, Plus } from "lucide-react";
import { DebtList } from "@/components/DebtList";
import { AddDebtDialog } from "@/components/AddDebtDialog";
import { CreditCardPurchases } from "@/components/CreditCardPurchases";
import { FixedExpenses } from "@/components/FixedExpenses";
import { MonthlyIncomeDialog } from "@/components/MonthlyIncomeDialog";
import { MonthlySummary } from "@/components/MonthlySummary";
import { ExtraIncomeList } from "@/components/ExtraIncomeList";

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
  totalAmount: number;
  installments: number;
  installmentValue: number;
  paidInstallments: number;
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

interface ExtraIncome {
  id: string;
  name: string;
  amount: number;
}

const Index = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [creditPurchases, setCreditPurchases] = useState<CreditPurchase[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [extraIncomes, setExtraIncomes] = useState<ExtraIncome[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);

  const totalDebts = debts.reduce((sum, debt) => sum + (debt.totalValue - (debt.paidInstallments * debt.installmentValue)), 0);
  const totalCreditPurchases = creditPurchases
    .filter(p => !p.isPaid)
    .reduce((sum, purchase) => sum + ((purchase.installments - purchase.paidInstallments) * purchase.installmentValue), 0);
  const totalFixedExpenses = fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExtraIncomes = extraIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalIncome = monthlyIncome + totalExtraIncomes;
  const availableBalance = totalIncome - totalFixedExpenses - debts.reduce((sum, debt) => sum + debt.installmentValue, 0);

  const addDebt = (debt: Omit<Debt, 'id'>) => {
    const newDebt = { ...debt, id: Date.now().toString() };
    setDebts([...debts, newDebt]);
  };

  const addCreditPurchase = (purchase: Omit<CreditPurchase, 'id'>) => {
    const newPurchase = { ...purchase, id: Date.now().toString() };
    setCreditPurchases([...creditPurchases, newPurchase]);
  };

  const addFixedExpense = (expense: Omit<FixedExpense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setFixedExpenses([...fixedExpenses, newExpense]);
  };

  const addExtraIncome = (income: Omit<ExtraIncome, 'id'>) => {
    const newIncome = { ...income, id: Date.now().toString() };
    setExtraIncomes([...extraIncomes, newIncome]);
  };

  const updateDebt = (debtId: string, updates: Partial<Debt>) => {
    setDebts(debts.map(debt => debt.id === debtId ? { ...debt, ...updates } : debt));
  };

  const updateCreditPurchase = (purchaseId: string, updates: Partial<CreditPurchase>) => {
    setCreditPurchases(creditPurchases.map(purchase => 
      purchase.id === purchaseId ? { ...purchase, ...updates } : purchase
    ));
  };

  const deleteDebt = (debtId: string) => {
    setDebts(debts.filter(debt => debt.id !== debtId));
  };

  const deleteCreditPurchase = (purchaseId: string) => {
    setCreditPurchases(creditPurchases.filter(purchase => purchase.id !== purchaseId));
  };

  const deleteFixedExpense = (expenseId: string) => {
    setFixedExpenses(fixedExpenses.filter(expense => expense.id !== expenseId));
  };

  const deleteExtraIncome = (incomeId: string) => {
    setExtraIncomes(extraIncomes.filter(income => income.id !== incomeId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Gestão Financeira Pessoal
          </h1>
          <p className="text-gray-600 text-lg">Controle suas finanças de forma inteligente</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Renda Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalIncome.toLocaleString('pt-BR')}</div>
              <div className="text-xs text-white/80 mt-1">
                <div>Salário: R$ {monthlyIncome.toLocaleString('pt-BR')}</div>
                <div>Extras: R$ {totalExtraIncomes.toLocaleString('pt-BR')}</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-white/20 mt-2"
                onClick={() => setIsIncomeDialogOpen(true)}
              >
                <Plus className="h-3 w-3 mr-1" />
                Editar
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Total Dívidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalDebts.toLocaleString('pt-BR')}</div>
              <p className="text-sm text-white/80">{debts.length} dívida(s) ativa(s)</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Gastos Fixos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalFixedExpenses.toLocaleString('pt-BR')}</div>
              <p className="text-sm text-white/80">{fixedExpenses.length} despesa(s) fixa(s)</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                A Receber
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalCreditPurchases.toLocaleString('pt-BR')}</div>
              <p className="text-sm text-white/80">Compras de terceiros</p>
            </CardContent>
          </Card>

          <Card className={`${availableBalance >= 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' : 'bg-gradient-to-r from-red-500 to-pink-600'} text-white border-0 shadow-lg`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Saldo Disponível
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {availableBalance.toLocaleString('pt-BR')}</div>
              <p className="text-sm text-white/80">
                {availableBalance >= 0 ? 'Positivo' : 'Negativo'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1">
            <TabsTrigger value="dashboard" className="text-xs sm:text-sm px-1 sm:px-3">
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Home</span>
            </TabsTrigger>
            <TabsTrigger value="debts" className="text-xs sm:text-sm px-1 sm:px-3">
              <span className="hidden sm:inline">Dívidas</span>
              <span className="sm:hidden">Dívidas</span>
            </TabsTrigger>
            <TabsTrigger value="credit" className="text-xs sm:text-sm px-1 sm:px-3">
              <span className="hidden sm:inline">Cartão</span>
              <span className="sm:hidden">Cartão</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs sm:text-sm px-1 sm:px-3">
              <span className="hidden sm:inline">Gastos Fixos</span>
              <span className="sm:hidden">Gastos</span>
            </TabsTrigger>
            <TabsTrigger value="income" className="text-xs sm:text-sm px-1 sm:px-3">
              <span className="hidden sm:inline">Rendas</span>
              <span className="sm:hidden">Rendas</span>
            </TabsTrigger>
            <TabsTrigger value="summary" className="text-xs sm:text-sm px-1 sm:px-3">
              <span className="hidden sm:inline">Resumo</span>
              <span className="sm:hidden">Resumo</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Resumo do Mês Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlySummary 
                  monthlyIncome={totalIncome}
                  debts={debts}
                  creditPurchases={creditPurchases}
                  fixedExpenses={fixedExpenses}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="debts" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Dívidas Parceladas</h2>
              <Button 
                onClick={() => setIsAddDebtOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Dívida
              </Button>
            </div>
            <DebtList 
              debts={debts} 
              onUpdateDebt={updateDebt} 
              onDeleteDebt={deleteDebt}
            />
          </TabsContent>

          <TabsContent value="credit" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Compras no Cartão para Terceiros</h2>
            </div>
            <CreditCardPurchases 
              purchases={creditPurchases}
              onAddPurchase={addCreditPurchase}
              onUpdatePurchase={updateCreditPurchase}
              onDeletePurchase={deleteCreditPurchase}
            />
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Gastos Fixos Mensais</h2>
            </div>
            <FixedExpenses 
              expenses={fixedExpenses}
              onAddExpense={addFixedExpense}
              onDeleteExpense={deleteFixedExpense}
            />
          </TabsContent>

          <TabsContent value="income" className="space-y-4">
            <ExtraIncomeList 
              extraIncomes={extraIncomes}
              onAddExtraIncome={addExtraIncome}
              onDeleteExtraIncome={deleteExtraIncome}
            />
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Resumo Mensal Detalhado</h2>
            <MonthlySummary 
              monthlyIncome={totalIncome}
              debts={debts}
              creditPurchases={creditPurchases}
              fixedExpenses={fixedExpenses}
              detailed={true}
            />
          </TabsContent>
        </Tabs>

        <AddDebtDialog 
          open={isAddDebtOpen}
          onOpenChange={setIsAddDebtOpen}
          onAddDebt={addDebt}
        />

        <MonthlyIncomeDialog 
          open={isIncomeDialogOpen}
          onOpenChange={setIsIncomeDialogOpen}
          currentIncome={monthlyIncome}
          onUpdateIncome={setMonthlyIncome}
        />
      </div>
    </div>
  );
};

export default Index;
