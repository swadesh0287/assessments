import data from '../../index.json';

export default function handler(req, res) {
    res.status(200).json(data.jobs);
  }