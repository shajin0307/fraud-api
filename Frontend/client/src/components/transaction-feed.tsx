import { Transaction } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getFraudPrediction } from "@/lib/api-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { RotateCcw, AlertTriangle, Shield, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TransactionFeedProps {
  transactions: Transaction[];
}

// Calculate risk score based on various factors
function calculateRiskScore(transaction: Transaction): { score: number; factors: string[] } {
  const factors: string[] = [];
  let score = 0;

  // Amount-based risk
  if (transaction.amount > 10000) {
    score += 30;
    factors.push("High value transaction");
  }

  // Time-based risk (high risk during odd hours)
  const hour = new Date(transaction.timestamp).getHours();
  if (hour < 6 || hour > 23) {
    score += 20;
    factors.push("Unusual transaction time");
  }

  // Category-based risk
  if (transaction.category === "electronics") {
    score += 15;
    factors.push("High-risk category");
  }

  // Status-based risk
  if (transaction.suspicious) {
    score += 35;
    factors.push("Marked as suspicious");
  }

  return { score, factors };
}

function RiskIndicator({ score, factors }: { score: number; factors: string[] }) {
  const getColor = () => {
    if (score >= 70) return "text-red-500";
    if (score >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  const getIcon = () => {
    if (score >= 70) return <AlertTriangle className="h-5 w-5" />;
    if (score >= 40) return <Info className="h-5 w-5" />;
    return <Shield className="h-5 w-5" />;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`flex items-center gap-2 ${getColor()}`}>
            {getIcon()}
            <span>{score}%</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-2">
            <p className="font-semibold">Risk Factors:</p>
            <ul className="list-disc list-inside text-sm">
              {factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function TransactionFeed({ transactions }: TransactionFeedProps) {
  const { toast } = useToast();

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/transactions/${id}/status`, { status });
      const updatedTransaction = await res.json();

      // Get fraud prediction for updated transaction
      const isFraud = await getFraudPrediction(updatedTransaction);
      if (isFraud) {
        toast({
          title: "Fraud Alert",
          description: "This transaction has been flagged as potentially fraudulent.",
          variant: "destructive",
        });
      }

      return updatedTransaction;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      toast({
        title: "Status Updated",
        description: "Transaction status has been updated successfully.",
      });
    },
  });

  const toggleStatus = (transaction: Transaction) => {
    const newStatus = transaction.status === "approved" ? "pending" : "approved";
    updateStatusMutation.mutate({ id: transaction.id, status: newStatus });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Risk Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => {
            const { score, factors } = calculateRiskScore(transaction);
            return (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(new Date(transaction.timestamp), "MMM d, HH:mm")}
                </TableCell>
                <TableCell>
                  {transaction.description}
                  {transaction.suspicious && (
                    <Badge variant="destructive" className="ml-2">
                      Suspicious
                    </Badge>
                  )}
                </TableCell>
                <TableCell>₹{(transaction.amount / 100).toFixed(2)}</TableCell>
                <TableCell>
                  <RiskIndicator score={score} factors={factors} />
                </TableCell>
                <TableCell>
                  <Badge
                    variant={transaction.status === "approved" ? "default" : "secondary"}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {transaction.status === "pending" ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: transaction.id,
                              status: "approved",
                            })
                          }
                          disabled={updateStatusMutation.isPending}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: transaction.id,
                              status: "rejected",
                            })
                          }
                          disabled={updateStatusMutation.isPending}
                        >
                          Reject
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleStatus(transaction)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Undo
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}