import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/auth.routes";
import tenantRoutes from "./modules/tenants/tenant.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tenants", tenantRoutes);

export default app;

