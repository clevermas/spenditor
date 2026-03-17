"use client";

import { TransactionTypesEnum } from "@/lib/transaction/transaction";
import { cn, titleCase } from "@/lib/utils";
import {
  Antenna,
  Baby,
  Bike,
  Bus,
  Car,
  CarTaxiFront,
  ChevronsDown,
  ChevronsUp,
  CircleDollarSign,
  CircleOff,
  Clapperboard,
  Clipboard,
  Cpu,
  Globe,
  HeartPulse,
  Home,
  Luggage,
  PawPrint,
  Shirt,
  ShoppingBasket,
  Smartphone,
  SprayCan,
  Utensils,
  Wallet,
  Watch,
} from "lucide-react";

export const IncomeCategoriesMap = {
  income: ChevronsUp,
  salary: Wallet,
  business: CircleDollarSign,
  "part-time job": Watch,
  other: Clipboard,
};

export const ExpenseCategoriesMap = {
  expense: ChevronsDown,
  "food and supermarkets": ShoppingBasket,
  home: Home,
  transport: Bus,
  "clothes and shoes": Shirt,
  health: HeartPulse,
  sport: Bike,
  "cafe and restaurants": Utensils,
  automobile: Car,
  taxi: CarTaxiFront,
  pets: PawPrint,
  children: Baby,
  beauty: SprayCan,
  travel: Luggage,
  telecom: Antenna,
  internet: Globe,
  entertainment: Clapperboard,
  "mobile phone": Smartphone,
  technology: Cpu,
  other: Clipboard,
};

export function TransactionCategory({
  type,
  category,
  className,
  iconColor,
}: {
  type: string | TransactionTypesEnum;
  category:
    | string
    | keyof typeof ExpenseCategoriesMap
    | keyof typeof IncomeCategoriesMap;
  className?;
  iconColor?;
}) {
  const Icon = (type === TransactionTypesEnum.Expense
          ? ExpenseCategoriesMap[
              category as keyof typeof ExpenseCategoriesMap
            ]
          : IncomeCategoriesMap[
              category as keyof typeof IncomeCategoriesMap
            ]);
  return (
    <div className={cn("flex items-center gap-2 text-base", className)}>
      <div style={iconColor ? { color: iconColor } : {}}>
        {category ? <Icon size={14} strokeWidth={2} /> : <CircleOff />}{" "}
      </div>

      {titleCase(category)}
    </div>
  );
}
