const Table = require('../models/Table');

const fields = ['number', 'capacity', 'status'];
const pickFields = (body) => Object.fromEntries(
  fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]])
);

const getTables = async (req, res, next) => {
  try {
    res.json(await Table.find().sort({ number: 1 }));
  } catch (error) {
    next(error);
  }
};

const getTable = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id);
    if (!table) return res.status(404).json({ message: 'Table not found' });
    return res.json(table);
  } catch (error) {
    return next(error);
  }
};

const createTable = async (req, res, next) => {
  try {
    const table = await Table.create(pickFields(req.body));
    res.status(201).json(table);
  } catch (error) {
    next(error);
  }
};

const updateTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, pickFields(req.body), {
      new: true,
      runValidators: true
    });
    if (!table) return res.status(404).json({ message: 'Table not found' });
    return res.json(table);
  } catch (error) {
    return next(error);
  }
};

const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ message: 'Table not found' });
    return res.json({ message: 'Table deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getTables, getTable, createTable, updateTable, deleteTable };
