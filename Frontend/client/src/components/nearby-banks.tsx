import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaUniversity, FaLandmark, FaRegBuilding, FaPiggyBank } from "react-icons/fa";
import { MapPin } from "lucide-react";

interface Bank {
  id: number;
  name: string;
  distance: string;
  address: string;
  icon: React.ReactNode;
}

const mockBanks: Bank[] = [
  {
    id: 1,
    name: "State Bank of India",
    distance: "0.5 km",
    address: "Connaught Place, New Delhi",
    icon: <FaUniversity className="h-6 w-6" />,
  },
  {
    id: 2,
    name: "HDFC Bank",
    distance: "0.8 km",
    address: "Nehru Place, New Delhi",
    icon: <FaPiggyBank className="h-6 w-6" />,
  },
  {
    id: 3,
    name: "ICICI Bank",
    distance: "1.2 km",
    address: "Rajouri Garden, New Delhi",
    icon: <FaLandmark className="h-6 w-6" />,
  },
  {
    id: 4,
    name: "Axis Bank",
    distance: "1.5 km",
    address: "South Extension, New Delhi",
    icon: <FaRegBuilding className="h-6 w-6" />,
  },
];

export function NearbyBanks() {
  const [banks] = useState<Bank[]>(mockBanks);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Nearby Banks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {banks.map((bank) => (
            <div
              key={bank.id}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="text-muted-foreground">{bank.icon}</div>
              <div>
                <h3 className="font-medium">{bank.name}</h3>
                <p className="text-sm text-muted-foreground">{bank.address}</p>
                <p className="text-xs text-muted-foreground">{bank.distance}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}