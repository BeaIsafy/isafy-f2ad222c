import { Settings as SettingsIcon, Palette, Users, Plug, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const tabs = [
  { id: "branding", label: "Branding", icon: Palette },
  { id: "equipe", label: "Equipe", icon: Users },
  { id: "integracoes", label: "Integrações", icon: Plug },
  { id: "assinatura", label: "Assinatura", icon: CreditCard },
];

const SettingsPage = () => {
  const [active, setActive] = useState("branding");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
        <p className="text-sm text-muted-foreground">Gerencie sua empresa e integrações</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              active === tab.id
                ? "gradient-primary text-primary-foreground shadow-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <Card className="shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <SettingsIcon size={18} className="text-primary" /> {tabs.find((t) => t.id === active)?.label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {active === "branding" && (
            <>
              <div><label className="text-sm font-medium text-foreground">Nome Fantasia</label><Input placeholder="Sua Imobiliária" className="mt-1" /></div>
              <div><label className="text-sm font-medium text-foreground">CNPJ</label><Input placeholder="00.000.000/0001-00" className="mt-1" /></div>
              <div><label className="text-sm font-medium text-foreground">CRECI</label><Input placeholder="000000-J" className="mt-1" /></div>
              <Button className="gradient-primary text-primary-foreground shadow-primary">Salvar Alterações</Button>
            </>
          )}
          {active !== "branding" && (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              <p className="text-sm">Configurações de {tabs.find((t) => t.id === active)?.label} em breve</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
