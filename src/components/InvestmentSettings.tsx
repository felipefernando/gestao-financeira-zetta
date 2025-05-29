
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Percent, Calculator } from "lucide-react";

interface InvestmentSettingsProps {
  investmentPercentage: number;
  onUpdatePercentage: (percentage: number) => void;
  availableBalance: number;
  suggestedInvestment: number;
}

export const InvestmentSettings = ({
  investmentPercentage,
  onUpdatePercentage,
  availableBalance,
  suggestedInvestment
}: InvestmentSettingsProps) => {
  const [tempPercentage, setTempPercentage] = useState(investmentPercentage.toString());

  const handleSave = () => {
    const percentage = parseFloat(tempPercentage);
    if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
      onUpdatePercentage(percentage);
    }
  };

  const handlePercentageChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setTempPercentage(value);
    } else if (value === '') {
      setTempPercentage('');
    }
  };

  const presetPercentages = [5, 10, 15, 20, 30];

  return (
    <div className="space-y-6">
      <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Configuração de Investimento Mensal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <Calculator className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm text-gray-600 mb-1">Saldo Disponível</p>
                  <p className="text-2xl font-bold text-blue-600">
                    R$ {availableBalance.toLocaleString('pt-BR')}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <Percent className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm text-gray-600 mb-1">Percentual Atual</p>
                  <p className="text-2xl font-bold text-green-600">
                    {investmentPercentage}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm text-gray-600 mb-1">Valor a Investir</p>
                  <p className="text-2xl font-bold text-purple-600">
                    R$ {suggestedInvestment.toLocaleString('pt-BR')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="percentage">Percentual para Investimento (%)</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="percentage"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={tempPercentage}
                  onChange={(e) => handlePercentageChange(e.target.value)}
                  placeholder="Digite o percentual"
                  className="flex-1"
                />
                <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Salvar
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Percentuais Sugeridos:</p>
              <div className="flex flex-wrap gap-2">
                {presetPercentages.map((preset) => (
                  <Button
                    key={preset}
                    variant={investmentPercentage === preset ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setTempPercentage(preset.toString());
                      onUpdatePercentage(preset);
                    }}
                    className="text-sm"
                  >
                    {preset}%
                  </Button>
                ))}
              </div>
            </div>

            {availableBalance <= 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">
                  ⚠️ Não há saldo disponível para investimento. Revise seus gastos e dívidas.
                </p>
              </div>
            )}

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Como funciona:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• O percentual é calculado sobre o saldo disponível (Renda - Gastos Fixos - Parcelas de Dívidas)</li>
                <li>• Ajuste o percentual conforme seus objetivos financeiros</li>
                <li>• O valor sugerido é uma orientação, você decide quanto investir</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
