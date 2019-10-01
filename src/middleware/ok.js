export const ok = (req, res, next) => {
  res.ok = () => res.json({ code: 200 });
  next();
};
