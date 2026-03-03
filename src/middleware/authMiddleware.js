import { supabase } from "../utils/supabase.js";

export const authenticate = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  const { data, error } = await supabase.auth.getUser(token);
  if (error) return res.status(401).json({ error: "Invalid token" });

  req.user = data.user;
  next();
};

export const authorizeRole = (tableName) => {
  return async (req, res, next) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select("id, hospital_id")
        .eq("id", req.user.id)
        .single();

      if (error || !data) {
        return res.status(403).json({ error: `Forbidden: Requires ${tableName} access` });
      }

      // Attach role-specific data to request for controllers to use
      req.roleData = data;
      next();
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error during authorization" });
    }
  };
};
