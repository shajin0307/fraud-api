import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@shared/schema";
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from "recharts";
import { TransactionHeatmap } from "./transaction-heatmap";
import { IndianRupee, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";

interface AnalyticsProps {
  transactions: Transaction[];
}

export function Analytics({ transactions }: AnalyticsProps) {
  const totalTransactions = transactions.length;
  const suspiciousCount = transactions.filter((t) => t.suspicious).length;
  const approvedCount = transactions.filter((t) => t.status === "approved").length;
  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  // Calculate time-based metrics (mock data for now)
  const hourlyData = [
    { hour: "12 AM", transactions: 45 },
    { hour: "3 AM", transactions: 20 },
    { hour: "6 AM", transactions: 35 },
    { hour: "9 AM", transactions: 85 },
    { hour: "12 PM", transactions: 120 },
    { hour: "3 PM", transactions: 95 },
    { hour: "6 PM", transactions: 75 },
    { hour: "9 PM", transactions: 55 },
  ];

  // Mock state-wise data
  const stateData = [
    { state: "Delhi", fraudCount: 25 },
    { state: "Mumbai", fraudCount: 30 },
    { state: "Bangalore", fraudCount: 20 },
    { state: "Chennai", fraudCount: 15 },
    { state: "Kolkata", fraudCount: 22 },
  ];

  // Mock category data
  const categoryData = [
    { category: "UPI", value: 45 },
    { category: "NEFT", value: 25 },
    { category: "RTGS", value: 15 },
    { category: "IMPS", value: 15 },
  ];

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalTransactions * 25000).toLocaleString('en-IN')}</div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              +20.1% from last month
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspicious Activity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suspiciousCount}</div>
            <div className="flex items-center text-xs text-red-500">
              <TrendingDown className="h-4 w-4 mr-1" />
              +5% increase in fraud attempts
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹24,500</div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12% this week
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.2%</div>
            <div className="flex items-center text-xs text-green-500">
              <TrendingUp className="h-4 w-4 mr-1" />
              +0.2% this week
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Hourly Transaction Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData}>
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="transactions" 
                    stroke="hsl(var(--chart-1))" 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => 
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <TransactionHeatmap transactions={transactions} />

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">State-wise Fraud Detection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData}>
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip />
                <Bar 
                  dataKey="fraudCount" 
                  fill="hsl(var(--chart-2))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}