export default (req, res) => {
    console.log('here logout');
    const url = '/login';
    res.redirect(url);
  };
  