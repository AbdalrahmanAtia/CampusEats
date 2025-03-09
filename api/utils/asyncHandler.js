const asyncHandler = (requestHandler) => {
  return async (req, res, next) => {
    try {
      await requestHandler(req, res, next);
    } catch (err) {
      console.error("❌ Error in asyncHandler:", err);
      if (typeof next === "function") {
        next(err);
      } else {
        console.error("⚠️ Warning: `next` is not a function");
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  };
};

export { asyncHandler };
