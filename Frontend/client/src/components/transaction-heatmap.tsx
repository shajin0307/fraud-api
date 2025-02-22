import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@shared/schema";

interface HeatmapProps {
  transactions: Transaction[];
}

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hours = Array.from({ length: 24 }, (_, i) => i);

export function TransactionHeatmap({ transactions }: HeatmapProps) {
  // Generate mock heatmap data (replace with real data processing in production)
  const heatmapData = days.map((day) =>
    hours.map((hour) => ({
      value: Math.floor(Math.random() * 100),
      color: `rgba(147, 51, 234, ${Math.random() * 0.8 + 0.2})`,
    }))
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Weekly Transaction Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-[auto_repeat(24,1fr)] gap-1">
              <div className="h-8" /> {/* Empty corner cell */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="h-8 flex items-center justify-center text-xs text-muted-foreground"
                >
                  {hour}:00
                </div>
              ))}
              {days.map((day, dayIndex) => (
                <>
                  <div
                    key={day}
                    className="flex items-center justify-end pr-2 text-sm text-muted-foreground"
                  >
                    {day}
                  </div>
                  {hours.map((hour) => (
                    <div
                      key={`${day}-${hour}`}
                      className="relative group"
                      style={{ height: "2rem" }}
                    >
                      <div
                        className="absolute inset-0.5 rounded-sm transition-colors hover:ring-2 hover:ring-primary/20"
                        style={{ backgroundColor: heatmapData[dayIndex][hour].color }}
                      >
                        <div className="absolute invisible group-hover:visible bg-popover text-popover-foreground rounded-md shadow-md p-2 text-xs -translate-y-full -translate-x-1/2 left-1/2 -top-1">
                          {heatmapData[dayIndex][hour].value} transactions
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
