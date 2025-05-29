
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, CreditCard, Receipt, Wallet, TrendingUp, Calendar, Plus, Target, ShoppingCart } from "lucide-react";
import { DebtList } from "@/components/DebtList";
import { AddDebtDialog } from "@/components/AddDebtDialog";
import { CreditCardPurchases } from "@/components/CreditCardPurchases";
import { FixedExpenses } from "@/components/FixedExpenses";
import { MonthlyIncomeDialog } from "@/components/MonthlyIncomeDialog";
import { MonthlySummary } from "@/components/MonthlySummary";
import { ExtraIncomeList } from "@/components/ExtraIncomeList";
import { InstallmentsList } from "@/components/InstallmentsList";
import { InvestmentSettings } from "@/components/InvestmentSettings";
import { SporadicExpenses } from "@/components/SporadicExpenses";
import { ShoppingList } from "@/components/ShoppingList";

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

interface SporadicExpense {
  id: string;
  name: string;
  amount: number;
  date: string;
}

interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

const Index = () => {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [creditPurchases, setCreditPurchases] = useState<CreditPurchase[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
  const [extraIncomes, setExtraIncomes] = useState<ExtraIncome[]>([]);
  const [sporadicExpenses, setSporadicExpenses] = useState<SporadicExpense[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [investmentPercentage, setInvestmentPercentage] = useState<number>(10);
  const [isAddDebtOpen, setIsAddDebtOpen] = useState(false);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);

  const totalDebts = debts.reduce((sum, debt) => sum + (debt.totalValue - (debt.paidInstallments * debt.installmentValue)), 0);
  const totalCreditPurchases = creditPurchases
    .filter(p => !p.isPaid)
    .reduce((sum, purchase) => sum + ((purchase.installments - purchase.paidInstallments) * purchase.installmentValue), 0);
  const totalFixedExpenses = fixedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalExtraIncomes = extraIncomes.reduce((sum, income) => sum + income.amount, 0);
  const totalSporadicExpenses = sporadicExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = monthlyIncome + totalExtraIncomes - totalSporadicExpenses;
  const monthlyDebtPayments = debts.reduce((sum, debt) => debt.isPaid ? 0 : sum + debt.installmentValue, 0);
  const availableBalance = totalIncome - totalFixedExpenses - monthlyDebtPayments;
  const suggestedInvestment = availableBalance > 0 ? (availableBalance * investmentPercentage) / 100 : 0;
  const finalBalance = availableBalance - suggestedInvestment;

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

  const addSporadicExpense = (expense: Omit<SporadicExpense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setSporadicExpenses([...sporadicExpenses, newExpense]);
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

  const deleteSporadicExpense = (expenseId: string) => {
    setSporadicExpenses(sporadicExpenses.filter(expense => expense.id !== expenseId));
  };

  const addShoppingItem = (item: Omit<ShoppingItem, 'id' | 'total'>) => {
    const total = item.quantity * item.price;
    const newItem = { 
      ...item, 
      id: Date.now().toString(),
      total 
    };
    setShoppingItems([...shoppingItems, newItem]);
  };

  const deleteShoppingItem = (itemId: string) => {
    setShoppingItems(shoppingItems.filter(item => item.id !== itemId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Gestão Financeira Pessoal
          </h1>
          <p className="text-gray-600 text-lg">Controle suas finanças de forma inteligente</p>
          <div className="mt-4">
            <Link to="/shopping-lists">
              <Button variant="outline" className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Ir para Listas de Compras
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
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
                {totalSporadicExpenses > 0 && (
                  <div>Gastos: -R$ {totalSporadicExpenses.toLocaleString('pt-BR')}</div>
                )}
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

          <Card className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Investimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {suggestedInvestment.toLocaleString('pt-BR')}</div>
              <p className="text-sm text-white/80">{investmentPercentage}% do saldo</p>
            </CardContent>
          </Card>

          <Card className={`${finalBalance >= 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' : 'bg-gradient-to-r from-red-500 to-pink-600'} text-white border-0 shadow-lg`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Saldo Final
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {finalBalance.toLocaleString('pt-BR')}</div>
              <p className="text-sm text-white/80">
                {finalBalance >= 0 ? 'Positivo' : 'Negativo'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Navigation */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8 gap-1 h-auto p-1">
            <TabsTrigger value="dashboard" className="text-xs px-2 py-2 data-[state=active]:bg-background">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="debts" className="text-xs px-2 py-2 data-[state=active]:bg-background">
              Dívidas
            </TabsTrigger>
            <TabsTrigger value="credit" className="text-xs px-2 py-2 data-[state=active]:bg-background">
              Cartão
            </TabsTrigger>
            <TabsTrigger value="installments" className="text-xs px-2 py-2 data-[state=active]:bg-background">
              Parcelas
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs px-2 py-2 data-[state=active]:bg-background">
              Gastos
            </TabsTrigger>
            <TabsTrigger value="sporadic" className="text-xs px-2 py-2 data-[state=active]:bg-background">
              Esporádicos
            </TabsTrigger>
            <TabsTrigger value="income" className="text-xs px-2 py-2 data-[state=active]:bg-background">
              Rendas
            </TabsTrigger>
            <TabsTrigger value="investment" className="text-xs px-2 py-2 data-[state=active]:bg-background">
              Investimento
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

          <TabsContent value="installments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Parcelas a Receber</h2>
            </div>
            <InstallmentsList purchases={creditPurchases} />
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

          <TabsContent value="sporadic" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Gastos Esporádicos</h2>
            </div>
            <SporadicExpenses 
              expenses={sporadicExpenses}
              onAddExpense={addSporadicExpense}
              onDeleteExpense={deleteSporadicExpense}
            />
          </TabsContent>

          <TabsContent value="income" className="space-y-4">
            <ExtraIncomeList 
              extraIncomes={extraIncomes}
              onAddExtraIncome={addExtraIncome}
              onDeleteExtraIncome={deleteExtraIncome}
            />
          </TabsContent>

          <TabsContent value="investment" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Configurações de Investimento</h2>
            </div>
            <InvestmentSettings 
              investmentPercentage={investmentPercentage}
              onUpdatePercentage={setInvestmentPercentage}
              availableBalance={availableBalance}
              suggestedInvestment={suggestedInvestment}
            />
          </TabsContent>

          <TabsContent value="shopping" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Lista de Compras</h2>
            </div>
            <ShoppingList 
              items={shoppingItems}
              onAddItem={addShoppingItem}
              onDeleteItem={deleteShoppingItem}
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
