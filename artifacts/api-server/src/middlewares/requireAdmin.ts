import type { Request, Response, NextFunction } from "express";

export function isAdminSession(req: Request): boolean {
  return (req.session as unknown as Record<string, unknown>)["isAdmin"] === true;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!isAdminSession(req)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}
