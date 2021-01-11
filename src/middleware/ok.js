export const ok = (req, res, next) => {
  res.ok = () => res.json({ code: 0, data: '', mess: '' });
  next();
};
