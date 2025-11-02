"use client";

import { useState, useMemo } from "react";
import { Listbox } from "@headlessui/react";
import { Car } from "@/types";

type Option = { label: string; value: string };

interface BrandSearchProps {
  onSearch?: (filters: { carName: string; carModel: string }) => void;
  brandId: string;
  cars: Car[];
}

const CAR_MODELS: Option[] = [
  { label: "Any", value: "" },
  { label: "2025", value: "2025" },
  { label: "2024", value: "2024" },
  { label: "2023", value: "2023" },
  { label: "2022", value: "2022" },
  { label: "2021", value: "2021" },
  { label: "2020", value: "2020" },
  { label: "2019", value: "2019" },
  { label: "2018", value: "2018" },
  { label: "2017", value: "2017" },
  { label: "2016", value: "2016" },
  { label: "2015", value: "2015" },
];

export default function BrandSearch({ onSearch, brandId, cars }: BrandSearchProps) {
  const [carName, setCarName] = useState<Option>({ label: "Any", value: "" });
  const [carModel, setCarModel] = useState<Option>(CAR_MODELS[0]);

  // Filter car names based on the current brand (or show all if brandId is empty, for category pages)
  const brandCarNames: Option[] = useMemo(() => {
    const brandCars = brandId ? cars.filter(car => car.brand === brandId) : cars;
    const uniqueNames = Array.from(new Set(brandCars.map(car => car.name)));
    
    return [
      { label: "Any", value: "" },
      ...uniqueNames.map(name => ({ label: name, value: name.toLowerCase() }))
    ];
  }, [brandId, cars]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      carName: carName.value,
      carModel: carModel.value,
    };
    // Brand search payload logged for debugging
    
    // Call the onSearch callback if provided
    if (onSearch) {
      onSearch(payload);
    }
  }

  return (
    <section className="w-full pb-10">
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-center"
      >
        {/* Car Name - Filtered by Brand */}
        <Field label="Car Name">
          <PillSelect value={carName} onChange={setCarName} options={brandCarNames} />
        </Field>

        {/* Car Model */}
        <Field label="Car Model">
          <PillSelect value={carModel} onChange={setCarModel} options={CAR_MODELS} />
        </Field>

        {/* Search */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 pl-4 opacity-0">Search</span>
          <button
            type="submit"
            className="h-14 rounded-full px-6 md:px-8 font-medium text-white bg-primary-300 hover:bg-primary-500 transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </form>
    </section>
  );
}

/* -------------------- Reusable bits -------------------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500 pl-4">{label}</span>
      {children}
    </div>
  );
}

/** Pill-style custom Select using Headless UI Listbox */
function PillSelect({
  value,
  onChange,
  options,
}: {
  value: Option;
  onChange: (o: Option) => void;
  options: Option[];
}) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative">
        <Listbox.Button
          className="h-14 min-w-[210px] rounded-full border border-gray-200 bg-white
                     px-5 pr-10 text-sm text-gray-900 text-left
                     hover:border-primary-500 focus:border-primary-500 transition-colors outline-none"
        >
          {value.label}
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">▾</span>
        </Listbox.Button>

        <Listbox.Options
          className="absolute z-50 mt-2 w-full rounded-2xl border border-gray-200 bg-white
                     overflow-hidden outline-none"
        >
          {options.map((opt) => (
            <Listbox.Option
              key={opt.label}
              value={opt}
              className={({ active, selected }) =>
                [
                  "cursor-pointer px-4 py-3 text-sm hover:text-primary-500",
                  active ? "bg-gray-50 text-primary-500" : "",
                  selected ? "font-medium text-primary-600" : "text-gray-800",
                ].join(" ")
              }
            >
              {opt.label}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>
  );
}
