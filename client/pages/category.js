import Header from '../components/Header'
import useSWR from 'swr'
const fetcher = url=>fetch(url).then(r=>r.json())
export default function Category(){ const { data } = useSWR('/api/proxy/products?page=1&per=24', fetcher); const items = data?.items||[];
 return (<div><Header/><div className='container' style={{paddingTop:18}}><h2>Categories</h2><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>{items.map(i=>(<div className='card' key={i.id}><img src={i.image} style={{width:'100%',height:120}}/><h4>{i.title}</h4></div>))}</div></div></div>) }