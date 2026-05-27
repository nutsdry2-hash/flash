import Link from 'next/link';

export default function Footer({ brandName = 'YourStore', categories = [] }) {
  return (
    <>
      {/* Offcanvas Menu */}
      <div className="offcanvas offcanvas-start" tabIndex="-1" id="sideMenu">
        <div className="offcanvas-header" style={{ backgroundColor: '#1F74BA', color: '#fff' }}>
          <h5 className="offcanvas-title">Menu</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
        </div>
        <div className="offcanvas-body p-0">
          <nav className="nav flex-column">
            <Link className="nav-link" href="/" style={{ color: '#212121' }}><i className="bi bi-house-door-fill me-2"></i>Home</Link>
            {categories.length > 0 && (
              <div className="nav-item">
                <a className="nav-link" href="#categoryCollapse" data-bs-toggle="collapse" style={{ color: '#212121' }}>
                  <i className="bi bi-grid-fill me-2"></i>Shop by Category
                </a>
                <div className="collapse" id="categoryCollapse">
                  <ul className="list-unstyled">
                    {categories.map(cat => (
                      <li key={cat}>
                        <Link className="dropdown-item ps-5" href={`/category?name=${encodeURIComponent(cat)}`} style={{ color: '#212121' }}>
                          {cat}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <Link className="nav-link" href="/about" style={{ color: '#212121' }}><i className="bi bi-info-circle-fill me-2"></i>About Us</Link>
            <hr className="my-2" />
            <Link className="nav-link" href="#" style={{ color: '#212121' }}><i className="bi bi-truck me-2"></i>Shipping Policy</Link>
            <Link className="nav-link" href="#" style={{ color: '#212121' }}><i className="bi bi-box-arrow-left me-2"></i>Return Policy</Link>
          </nav>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-grid mb-4">
          <div>
            <h4>Quick Links</h4>
            <ul className="footer-list">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="#">Contact Us</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Terms & Conditions</Link></li>
              <li><Link href="#">Shipping Policy</Link></li>
              <li><Link href="#">Return & Refund Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4>Categories</h4>
            <ul className="footer-list">
              {categories.slice(0, 6).map(cat => (
                <li key={cat}><Link href={`/category?name=${encodeURIComponent(cat)}`}>{cat}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {brandName}. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
