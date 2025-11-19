import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/registrations", async (req, res) => {
    try {
      const validationResult = insertRegistrationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        const validationError = fromZodError(validationResult.error);
        return res.status(400).json({
          error: "Validation failed",
          message: validationError.message,
          details: validationResult.error.issues,
        });
      }

      const registration = await storage.createRegistration(validationResult.data);
      
      return res.status(201).json(registration);
    } catch (error) {
      console.error("Error creating registration:", error);
      return res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  });

  app.get("/api/registrations", async (req, res) => {
    try {
      const registrations = await storage.getAllRegistrations();
      return res.status(200).json(registrations);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      return res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  });

  app.get("/api/registrations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const registration = await storage.getRegistration(id);
      
      if (!registration) {
        return res.status(404).json({
          error: "Not found",
          message: `Registration with id ${id} not found`,
        });
      }
      
      return res.status(200).json(registration);
    } catch (error) {
      console.error("Error fetching registration:", error);
      return res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
