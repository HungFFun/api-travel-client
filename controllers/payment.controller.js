const payment = async (req, res) => {
  try {

      res.status(200).send({ message: "Thanh toán thành công" });
  } catch (error) {
    res.status(500).send({ message: "Lỗi"});
  }
};

module.exports = {
  payment,
};
