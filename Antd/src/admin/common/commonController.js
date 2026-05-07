// Model parameter represents the name of each modele such as Cars, Owners, Drivers,.......
export const commonController = (Model) => ({
  // GET /resource
  async list(req, res) {
    try {
      const filter = {
        companyId: req.user.companyID,
      };

      const search = req.query.search;
      if (search) {
        filter.$or = [
          {
            name: { $regex: search, $options: "i" },
          },
        ];
      }

      const data = await Model.find(filter);
      return res.json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /resource/:id
  async getOne(req, res) {
    try {
      const record = await Model.findOne({
        _id: req.params.id,
        companyId: req.user.companyID,
      });

      if (!record)
        return res.status(404).json({ success: false, message: "Not found" });

      return res.json({ success: true, record });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // POST /resource
  async create(req, res) {
    try {
      const data = await Model.create({
        ...req.body,
        companyId: req.user.companyID,
        userId: req.user.id,
      });

      return res.status(201).json({ success: true, data });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // PUT /resource/:id
  async update(req, res) {
    try {
      const updated = await Model.findOneAndUpdate(
        {
          _id: req.params.id,
          companyId: req.user.companyID,
        },
        req.body,
        { new: true }
      );

      if (!updated)
        return res.status(404).json({ success: false, message: "Not found" });

      return res.json({ success: true, updated });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  // DELETE /resource/:id
  async remove(req, res) {
    try {
      const deleted = await Model.findOneAndDelete({
        _id: req.params.id,
        companyId: req.user.companyID,
      });

      if (!deleted)
        return res.status(404).json({ success: false, message: "Not found" });

      return res.json({ success: true, deleted });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },
});
