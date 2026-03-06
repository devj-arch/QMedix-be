export const authorize =
  (...allowedRoles) =>
  (req, res, next) => {
   const role = req.user?.user_metadata?.role;

    console.log("User role:", role);
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
