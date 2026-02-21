import { BarChart3, Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Reports = () => (
  <div className="space-y-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
        <p className="text-sm text-muted-foreground">Análise de desempenho e métricas</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2"><Filter size={16} /> Filtros</Button>
        <Button variant="outline" className="gap-2"><Download size={16} /> Exportar</Button>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[
        { label: "VGV Total", value: "R$ 12.8M" },
        { label: "VGC Total", value: "R$ 384K" },
        { label: "Imóveis Vendidos", value: "42" },
        { label: "Taxa Conversão", value: "8.2%" },
      ].map((m) => (
        <Card key={m.label} className="shadow-card border-border/50">
          <CardContent className="p-5 text-center">
            <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
            <p className="text-2xl font-bold text-gradient mt-1">{m.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>

    <Card className="shadow-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base"><BarChart3 size={18} className="text-primary" /> Desempenho Mensal</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          <p className="text-sm">Gráficos serão exibidos aqui com dados reais</p>
        </div>
      </CardContent>
    </Card>
  </div>
);

export default Reports;
