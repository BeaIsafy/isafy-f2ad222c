import { User, Camera, Save, Target, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

const ProfilePage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
      <p className="text-sm text-muted-foreground">Gerencie suas informações pessoais</p>
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><User size={18} className="text-primary" /> Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center rounded-full gradient-primary text-2xl font-bold text-primary-foreground">JD</div>
                <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-card border border-border shadow-sm"><Camera size={14} className="text-muted-foreground" /></button>
              </div>
              <div><p className="font-semibold text-foreground">João da Silva</p><p className="text-sm text-muted-foreground">Corretor</p></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className="text-sm font-medium text-foreground">Nome Completo</label><Input defaultValue="João da Silva" className="mt-1" /></div>
              <div><label className="text-sm font-medium text-foreground">E-mail</label><Input defaultValue="joao@imobiliaria.com" className="mt-1" /></div>
              <div><label className="text-sm font-medium text-foreground">Telefone</label><Input defaultValue="(11) 99123-4567" className="mt-1" /></div>
              <div><label className="text-sm font-medium text-foreground">CRECI</label><Input defaultValue="123456-F" className="mt-1" /></div>
            </div>
            <div className="flex gap-2">
              <Button className="gradient-primary text-primary-foreground shadow-primary gap-2"><Save size={16} /> Salvar</Button>
              <Button variant="outline">Alterar Senha</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Target size={18} className="text-primary" /> Meta Mensal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-3xl font-extrabold text-gradient">R$ 1.8M</p>
              <p className="text-sm text-muted-foreground">de R$ 3.0M</p>
            </div>
            <Progress value={60} className="h-3" />
            <p className="text-center text-xs text-muted-foreground">60% atingida</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-destructive/20">
          <CardContent className="p-5">
            <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5"><Trash2 size={16} /> Cancelar Conta</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
);

export default ProfilePage;
