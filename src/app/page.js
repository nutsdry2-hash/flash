'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CATS = [
  {name:'Furniture',img:'fur.webp',label:'Furniture'},
  {name:'Electronics',img:'ele.webp',label:'Electronics'},
  {name:'Appliances',img:'kit.webp',label:'Appliances'},
  {name:'MOBILE',img:'mob.webp',label:'Mobiles'},
  {name:'kurtis',img:'kur.webp',label:'Kurtis'},
  {name:'Western Wear',img:'west.webp',label:'Western Wear'},
  {name:'Crocs',img:'cro.webp',label:'Crocs'},
  {name:'Shoes',img:'shoes.webp',label:'Shoes'},
  {name:'Grocery',img:'gro.webp',label:'Grocery'},
  {name:'dryfruit',img:'dryfruit.webp',label:'Dry Fruits'},
];

function Stars({r}){
  const n=parseFloat(r)||4;const f=Math.floor(n);
  return <div className="stars">{[...Array(f)].map((_,i)=><i key={i} className="bi bi-star-fill"/>)}{[...Array(5-f)].map((_,i)=><i key={i} className="bi bi-star" style={{color:'#e0e0e0'}}/>)}</div>;
}

export default function Home(){
  const [prods,setProds]=useState([]);
  const [page,setPage]=useState(1);
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);
  const [siteUrl,setSiteUrl]=useState('');
  const [brand,setBrand]=useState('Shop');
  const [cats,setCats]=useState([]);
  const [cartCount,setCartCount]=useState(0);
  const [search,setSearch]=useState('');
  const [timer,setTimer]=useState(599);
  const router=useRouter();

  useEffect(()=>{
    fetch('/api/settings').then(r=>r.json()).then(d=>{
      if(d.success){setSiteUrl(d.siteUrl||'');setBrand(d.settings?.brand_name||'Shop');}
    });
    fetch('/api/products?type=categories').then(r=>r.json()).then(d=>{if(d.success)setCats(d.data);});
    fetch('/api/cart?type=count').then(r=>r.json()).then(d=>{if(d.success)setCartCount(d.count);});
    load(1);
    const t=setInterval(()=>setTimer(v=>v<=0?599:v-1),1000);
    return()=>clearInterval(t);
  },[]);

  const load=useCallback(async(p)=>{
    if(loading||done)return;
    setLoading(true);
    const d=await fetch(`/api/products?page=${p}&limit=10`).then(r=>r.json());
    if(d.success&&d.data.length){setProds(v=>[...v,...d.data]);setPage(p+1);if(!d.hasMore)setDone(true);}
    else setDone(true);
    setLoading(false);
  },[loading,done]);

  useEffect(()=>{
    const fn=()=>{if(window.innerHeight+window.scrollY>=document.body.offsetHeight-500)load(page);};
    window.addEventListener('scroll',fn);return()=>window.removeEventListener('scroll',fn);
  },[page,load]);

  const timerStr=`${String(Math.floor(timer/60)).padStart(2,'0')}:${String(timer%60).padStart(2,'0')}`;
  const base=siteUrl?`${siteUrl}/assets/`:'';

  return(
    <>
    <div style={{maxWidth:1248,margin:'0 auto',background:'#fff',minHeight:'100vh'}}>
      {/* Header */}
      <header className="pg-header">
        <div className="top-bar">
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <button className="btn p-0 d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#menu">
              <i className="bi bi-list" style={{fontSize:24,color:'#212121'}}/>
            </button>
            <Link href="/"><span style={{fontSize:18,fontWeight:700,color:'#2874f0'}}>{brand}</span></Link>
          </div>
          <Link href="/cart" style={{color:'#212121',position:'relative'}}>
            <i className="bi bi-cart3" style={{fontSize:22}}/>
            {cartCount>0&&<span className="badge bg-danger rounded-pill" style={{position:'absolute',top:-8,right:-10,fontSize:9}}>{cartCount}</span>}
          </Link>
        </div>
        <form onSubmit={e=>{e.preventDefault();if(search.trim())router.push(`/category?search=${encodeURIComponent(search)}`)}}>
          <div className="search-wrap">
            <i className="bi bi-search" style={{opacity:.5}}/>
            <input placeholder="Search for Products..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
        </form>
      </header>

      <main>
        {/* Banner */}
        <div style={{padding:'8px 8px 0'}}>
          <div id="carousel1" className="carousel slide rounded-3 overflow-hidden" data-bs-ride="carousel">
            <div className="carousel-inner">
              <div className="carousel-item active"><img src={`${base}catogary/banner1.webp`} className="d-block w-100" alt="Banner" onError={e=>{e.target.style.display='none'}}/></div>
              <div className="carousel-item"><img src={`${base}catogary/banner2.webp`} className="d-block w-100" alt="Banner 2" onError={e=>{e.target.style.display='none'}}/></div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div style={{padding:6,background:'#fff',marginTop:8}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:4,textAlign:'center'}}>
            {CATS.map(c=>(
              <Link key={c.name} href={`/category?name=${encodeURIComponent(c.name)}`} style={{color:'#333'}}>
                <img src={`${base}catogary/${c.img}`} alt={c.label} style={{width:40,height:40,objectFit:'contain'}} onError={e=>{e.target.style.display='none'}}/>
                <p style={{fontSize:11,fontWeight:500,marginTop:3,lineHeight:1.2}}>{c.label}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Deal Banner */}
        <div className="deal-banner">
          <div>
            <div className="deal-title">Deals of the Day</div>
            <div className="deal-timer">{timerStr}</div>
          </div>
          <div className="sale-badge">SALE IS LIVE</div>
        </div>

        {/* Products Grid */}
        <div style={{background:'#f1f2f4',paddingTop:1}}>
          <div className="mainbody">
            {prods.map(p=>{
              const wow=Math.round(p.total*.95);
              return(
                <Link key={p.id} href={`/product?pid=${p.id}`} className="pcard">
                  <div className="pcard-inner">
                    <img src={`${base}${p.image}`} className="pimg" alt={p.name} loading="lazy"
                      onError={e=>{e.target.src='https://placehold.co/150x150?text=...'}}/>
                    <p className="pname">{p.name}</p>
                    <div style={{display:'flex',alignItems:'center',flexWrap:'wrap'}}>
                      <span className="pprice">₹{Number(p.total).toLocaleString('en-IN')}</span>
                      <del className="pmrp">₹{Number(p.price).toLocaleString('en-IN')}</del>
                      <span className="pdisc">{p.discount}% off</span>
                    </div>
                    <div className="wow-row">
                      <span className="wow-p">₹{wow.toLocaleString('en-IN')}</span>
                      <span className="wow-t">with 2 offers</span>
                    </div>
                    <Stars r={p.star}/>
                  </div>
                </Link>
              );
            })}
          </div>
          {loading&&<div style={{textAlign:'center',padding:20}}><div className="spinner-border text-primary"/></div>}
        </div>
      </main>

      {/* Offcanvas */}
      <div className="offcanvas offcanvas-start" id="menu" tabIndex="-1">
        <div className="offcanvas-header" style={{background:'#1F74BA',color:'#fff'}}>
          <h5 className="offcanvas-title">{brand}</h5>
          <button className="btn-close btn-close-white" data-bs-dismiss="offcanvas"/>
        </div>
        <div className="offcanvas-body p-0">
          <nav className="nav flex-column">
            <Link className="nav-link" href="/" style={{color:'#212121'}}><i className="bi bi-house-door-fill me-2"/>Home</Link>
            <Link className="nav-link" href="/about" style={{color:'#212121'}}><i className="bi bi-info-circle-fill me-2"/>About Us</Link>
            <hr className="my-1"/>
            {cats.map(c=><Link key={c} className="nav-link py-1 ps-4" href={`/category?name=${encodeURIComponent(c)}`} style={{color:'#555',fontSize:13}}>{c}</Link>)}
          </nav>
        </div>
      </div>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-grid mb-3">
          <div>
            <p className="footer-h">Quick Links</p>
            <ul className="footer-list">
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
              <li><Link href="#">Shipping Policy</Link></li>
              <li><Link href="#">Return Policy</Link></li>
            </ul>
          </div>
          <div>
            <p className="footer-h">Categories</p>
            <ul className="footer-list">
              {cats.slice(0,6).map(c=><li key={c}><Link href={`/category?name=${encodeURIComponent(c)}`}>{c}</Link></li>)}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">© {new Date().getFullYear()} {brand}. All rights reserved.</div>
      </footer>
    </div>
    </>
  );
}
