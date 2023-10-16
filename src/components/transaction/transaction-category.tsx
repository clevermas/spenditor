"use client";

import { TransactionTypesEnum } from "@/lib/transaction/transaction";
import { titleCase } from "@/lib/utils";
import {
  Antenna,
  Baby,
  Bike,
  Bus,
  Car,
  CarTaxiFront,
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

const IncomeCategoriesMap = {
  uncategorised: <CircleOff />,
  salary: <Wallet />,
  business: <CircleDollarSign />,
  "part-time job": <Watch />,
  other: <Clipboard />,
};

const ExpenseCategoriesMap = {
  uncategorised: <CircleOff />,
  "food and supermarkets": <ShoppingBasket />,
  home: <Home />,
  transport: <Bus />,
  "clothes and shoes": <Shirt />,
  health: <HeartPulse />,
  sport: <Bike />,
  "cafe and restaurants": <Utensils />,
  automobile: <Car />,
  taxi: <CarTaxiFront />,
  pets: <PawPrint />,
  children: <Baby />,
  beauty: <SprayCan />,
  travel: <Luggage />,
  telecom: <Antenna />,
  internet: <Globe />,
  entertainment: <Clapperboard />,
  "mobile phone": <Smartphone />,
  technology: <Cpu />,
  other: <Clipboard />,
};

export function TransactionCategory({
  type,
  category,
}: {
  type: TransactionTypesEnum;
  category: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {(type === TransactionTypesEnum.Expense
        ? ExpenseCategoriesMap[category]
        : IncomeCategoriesMap[category]) || <CircleOff />}{" "}
      {titleCase(category)}
    </div>
  );
}
