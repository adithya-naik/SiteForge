export const getCurrentUser = async (req, res) => {
  try {

    if (!req.user) {
      return res.json({
        user: null
      });
    }

    return res.json(req.user);
  } catch (_error) {
    return res.status(500).json({
      message: 'GetCurrent Error'
    });
  }
};