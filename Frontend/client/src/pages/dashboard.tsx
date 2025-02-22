import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@shared/schema";
import { Analytics } from "@/components/analytics-charts";
import { TransactionFeed } from "@/components/transaction-feed";
import { Sidebar } from "@/components/site-sidebar";
import { Input } from "@/components/ui/input";
import { NotificationCenter } from "@/components/notification-center";
import { NearbyBanks } from "@/components/nearby-banks";
import { useState } from "react";

export default function Dashboard() {
  const [search, setSearch] = useState("");

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  const filteredTransactions = transactions.filter((t) =>
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-[220px_1fr_300px]">
      <Sidebar className="border-r" />
      <div className="p-8 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold glow-text">Transaction Monitor</h1>
            <p className="text-muted-foreground">Track and manage suspicious activities</p>
          </div>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search transactions..."
              className="w-[300px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <NotificationCenter />
          </div>
        </div>

        <Analytics transactions={transactions} />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <TransactionFeed transactions={filteredTransactions} />
        </div>
      </div>
      <div className="p-6 border-l">
        <NearbyBanks />
      </div>
    </div>
  );
}