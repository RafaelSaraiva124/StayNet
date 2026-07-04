"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, X, MapPin, Building2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HotelFiltersProps {
  cities: string[];
  countries: string[];
  totalHotels: number;
  filteredCount: number;
  hasActiveFilters: boolean;
}

export default function HotelFilters({
  cities,
  countries,
  totalHotels,
  filteredCount,
  hasActiveFilters,
}: HotelFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || "",
  );

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "" || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/discover?${params.toString()}`, { scroll: false });
  };

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    const timer = setTimeout(() => {
      updateFilters("search", value);
    }, 300);
    return () => clearTimeout(timer);
  };

  const clearFilters = () => {
    setSearchValue("");
    router.push("/discover", { scroll: false });
  };

  const activeFiltersCount = [
    searchParams.get("search"),
    searchParams.get("city") !== "all" && searchParams.get("city"),
    searchParams.get("country") !== "all" && searchParams.get("country"),
  ].filter(Boolean).length;

  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Pesquisar por nome, cidade ou país..."
          value={searchValue}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4 h-12 text-base bg-card border-border focus:border-brand focus:ring-brand"
        />
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="ml-1 bg-brand text-primary-foreground text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
            Limpar filtros
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Cidade
              </label>
              <Select
                value={searchParams.get("city") || "all"}
                onValueChange={(value) => updateFilters("city", value)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Todas as cidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                País
              </label>
              <Select
                value={searchParams.get("country") || "all"}
                onValueChange={(value) => updateFilters("country", value)}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Todos os países" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os países</SelectItem>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {filteredCount !== totalHotels && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            A mostrar {filteredCount} de {totalHotels}{" "}
            {filteredCount === 1 ? "hotel" : "hotéis"}
          </p>
        </div>
      )}
    </div>
  );
}
