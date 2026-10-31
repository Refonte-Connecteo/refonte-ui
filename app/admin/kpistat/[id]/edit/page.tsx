"use client";

import { useState, type FormEvent, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { api } from "@/lib/api";
import {
  Card,
  Button,
  FormPage,
  LoadingScreen,
  Alert,
  Label,
  Input,
  Checkbox,
} from "@/app/admin/components/ui";

export default function KpiStatEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [label, setLabel] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [position, setPosition] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { router.push("/admin/login"); return; }
    fetchStat();
  }, []);

  const fetchStat = async () => {
    try {
      const result = await api.getKpiStat(id);
      setLabel(result.stat.label);
      setValue(result.stat.value);
      setUnit(result.stat.unit ?? "");
      setPosition(result.stat.position);
      setIsActive(result.stat.is_active);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const result = await api.updateKpiStat(id, {
        label,
        value,
        unit: unit || null,
        position,
        is_active: isActive,
      });
      setSuccess(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <LoadingScreen />;
  }

  return (
    <FormPage title={`Modifier le KPI #${id}`} backHref="/admin/kpistat">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <Alert>{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <div>
              <Label htmlFor="label">Label *</Label>
              <Input id="label" type="text" required value={label}
                onChange={(e) => setLabel(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="value">Valeur *</Label>
              <Input id="value" type="text" required value={value}
                onChange={(e) => setValue(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="unit">Unité</Label>
              <Input id="unit" type="text" value={unit}
                onChange={(e) => setUnit(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="position">Position</Label>
                <Input id="position" type="number" value={position}
                  onChange={(e) => setPosition(Number(e.target.value))} />
              </div>
              <div>
                <Label>Actif</Label>
                <label className="inline-flex items-center gap-2 cursor-pointer mt-2">
                  <Checkbox checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)} />
                  <span className="text-sm text-gray-600">{isActive ? "Oui" : "Non"}</span>
                </label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </Button>
          </form>
        </Card>
      </FormPage>
  );
}
