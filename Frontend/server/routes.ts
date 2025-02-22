import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const transactions = await storage.getTransactions(req.user.id);
    res.json(transactions);
  });

  app.patch("/api/transactions/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { status } = req.body;
    const transaction = await storage.updateTransactionStatus(
      parseInt(req.params.id),
      status
    );
    res.json(transaction);
  });

  const httpServer = createServer(app);
  return httpServer;
}
